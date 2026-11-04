'use client';

import { useEffect, useRef, useContext } from 'react';
import { LoadingContext } from './ClientWrapper';

type RGBColor = {
  r: number;
  g: number;
  b: number;
};

type PointerState = {
  id: number;
  texcoordX: number;
  texcoordY: number;
  prevTexcoordX: number;
  prevTexcoordY: number;
  deltaX: number;
  deltaY: number;
  down: boolean;
  moved: boolean;
  color: RGBColor;
};

type UniformMap = Record<string, WebGLUniformLocation | null>;

type SupportedFormat = {
  internalFormat: number;
  format: number;
};

type SingleFBO = {
  texture: WebGLTexture;
  fbo: WebGLFramebuffer;
  width: number;
  height: number;
  texelSizeX: number;
  texelSizeY: number;
  attach: (id: number) => number;
};

type DoubleFBO = {
  width: number;
  height: number;
  texelSizeX: number;
  texelSizeY: number;
  read: SingleFBO;
  write: SingleFBO;
  swap: () => void;
};

type SplashCursorProps = {
  SIM_RESOLUTION?: number;
  DYE_RESOLUTION?: number;
  CAPTURE_RESOLUTION?: number;
  DENSITY_DISSIPATION?: number;
  VELOCITY_DISSIPATION?: number;
  PRESSURE?: number;
  PRESSURE_ITERATIONS?: number;
  CURL?: number;
  SPLAT_RADIUS?: number;
  SPLAT_FORCE?: number;
  SHADING?: boolean;
  COLOR_UPDATE_SPEED?: number;
  BACK_COLOR?: RGBColor;
  TRANSPARENT?: boolean;
  RAINBOW_MODE?: boolean;
  COLOR?: string;
};

type SimulationConfig = Required<SplashCursorProps> & {
  PAUSED: boolean;
};

type GLContextBundle = {
  gl: WebGLRenderingContext | WebGL2RenderingContext;
  ext: {
    formatRGBA: SupportedFormat;
    formatRG: SupportedFormat;
    formatR: SupportedFormat;
    halfFloatTexType: number;
    supportLinearFiltering: boolean;
  };
};

const DEFAULT_BACK_COLOR: RGBColor = { r: 0.5, g: 0, b: 0 };

class Program {
  uniforms: UniformMap;
  program: WebGLProgram;
  gl: WebGLRenderingContext | WebGL2RenderingContext;

  constructor(
    gl: WebGLRenderingContext | WebGL2RenderingContext,
    vertexShader: WebGLShader,
    fragmentShader: WebGLShader,
  ) {
    this.gl = gl;
    this.program = createProgram(gl, vertexShader, fragmentShader);
    this.uniforms = getUniforms(gl, this.program);
  }

  bind() {
    this.gl.useProgram(this.program);
  }
}

class Material {
  gl: WebGLRenderingContext | WebGL2RenderingContext;
  vertexShader: WebGLShader;
  fragmentShaderSource: string;
  programs: Record<number, WebGLProgram>;
  activeProgram: WebGLProgram | null;
  uniforms: UniformMap;

  constructor(
    gl: WebGLRenderingContext | WebGL2RenderingContext,
    vertexShader: WebGLShader,
    fragmentShaderSource: string,
  ) {
    this.gl = gl;
    this.vertexShader = vertexShader;
    this.fragmentShaderSource = fragmentShaderSource;
    this.programs = {};
    this.activeProgram = null;
    this.uniforms = {};
  }

  setKeywords(keywords: string[]) {
    let hash = 0;
    for (const keyword of keywords) {
      hash += hashCode(keyword);
    }

    let program = this.programs[hash];
    if (!program) {
      const fragmentShader = compileShader(
        this.gl,
        this.gl.FRAGMENT_SHADER,
        this.fragmentShaderSource,
        keywords,
      );
      program = createProgram(this.gl, this.vertexShader, fragmentShader);
      this.programs[hash] = program;
    }

    if (program === this.activeProgram) {
      return;
    }

    this.uniforms = getUniforms(this.gl, program);
    this.activeProgram = program;
  }

  bind() {
    if (!this.activeProgram) {
      return;
    }
    this.gl.useProgram(this.activeProgram);
  }
}

function createPointer(): PointerState {
  return {
    id: -1,
    texcoordX: 0,
    texcoordY: 0,
    prevTexcoordX: 0,
    prevTexcoordY: 0,
    deltaX: 0,
    deltaY: 0,
    down: false,
    moved: false,
    color: { r: 0, g: 0, b: 0 },
  };
}

function addKeywords(source: string, keywords?: string[]) {
  if (!keywords || keywords.length === 0) {
    return source;
  }

  const keywordsString = keywords.map((keyword) => `#define ${keyword}`).join('\n');
  return `${keywordsString}\n${source}`;
}

function compileShader(
  gl: WebGLRenderingContext | WebGL2RenderingContext,
  type: number,
  source: string,
  keywords?: string[],
) {
  const shader = gl.createShader(type);
  if (!shader) {
    throw new Error('Unable to create shader.');
  }

  gl.shaderSource(shader, addKeywords(source, keywords));
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const message = gl.getShaderInfoLog(shader) ?? 'Unknown shader compilation error.';
    gl.deleteShader(shader);
    throw new Error(message);
  }

  return shader;
}

function createProgram(
  gl: WebGLRenderingContext | WebGL2RenderingContext,
  vertexShader: WebGLShader,
  fragmentShader: WebGLShader,
) {
  const program = gl.createProgram();
  if (!program) {
    throw new Error('Unable to create WebGL program.');
  }

  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    const message = gl.getProgramInfoLog(program) ?? 'Unknown program link error.';
    gl.deleteProgram(program);
    throw new Error(message);
  }

  return program;
}

function getUniforms(
  gl: WebGLRenderingContext | WebGL2RenderingContext,
  program: WebGLProgram,
): UniformMap {
  const uniforms: UniformMap = {};
  const uniformCount = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);

  for (let i = 0; i < uniformCount; i += 1) {
    const info = gl.getActiveUniform(program, i);
    if (!info) {
      continue;
    }

    uniforms[info.name] = gl.getUniformLocation(program, info.name);
  }

  return uniforms;
}

function supportRenderTextureFormat(
  gl: WebGLRenderingContext | WebGL2RenderingContext,
  internalFormat: number,
  format: number,
  type: number,
) {
  const texture = gl.createTexture();
  const framebuffer = gl.createFramebuffer();

  if (!texture || !framebuffer) {
    return false;
  }

  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texImage2D(gl.TEXTURE_2D, 0, internalFormat, 4, 4, 0, format, type, null);

  gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
  gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);

  const isSupported = gl.checkFramebufferStatus(gl.FRAMEBUFFER) === gl.FRAMEBUFFER_COMPLETE;

  gl.deleteTexture(texture);
  gl.deleteFramebuffer(framebuffer);

  return isSupported;
}

function getSupportedFormat(
  gl: WebGLRenderingContext | WebGL2RenderingContext,
  internalFormat: number,
  format: number,
  type: number,
): SupportedFormat | null {
  if (!supportRenderTextureFormat(gl, internalFormat, format, type)) {
    if ('R16F' in gl && internalFormat === gl.R16F) {
      return getSupportedFormat(gl, gl.RG16F, gl.RG, type);
    }

    if ('RG16F' in gl && internalFormat === gl.RG16F) {
      return getSupportedFormat(gl, gl.RGBA16F, gl.RGBA, type);
    }

    return null;
  }

  return { internalFormat, format };
}

function getWebGLContext(canvas: HTMLCanvasElement): GLContextBundle | null {
  const params: WebGLContextAttributes = {
    alpha: true,
    depth: false,
    stencil: false,
    antialias: false,
    preserveDrawingBuffer: false,
  };

  const webgl2Context = canvas.getContext('webgl2', params) as WebGL2RenderingContext | null;
  let gl: WebGLRenderingContext | WebGL2RenderingContext | null = webgl2Context;
  const isWebGL2 = Boolean(webgl2Context);

  if (!gl) {
    gl =
      (canvas.getContext('webgl', params) as WebGLRenderingContext | null) ??
      (canvas.getContext('experimental-webgl', params) as WebGLRenderingContext | null);
  }

  if (!gl) {
    return null;
  }

  let halfFloatTexType: number | null = null;
  let supportLinearFiltering = false;

  if (isWebGL2) {
    const webgl2 = gl as WebGL2RenderingContext;
    webgl2.getExtension('EXT_color_buffer_float');
    supportLinearFiltering = Boolean(webgl2.getExtension('OES_texture_float_linear'));
    halfFloatTexType = webgl2.HALF_FLOAT;
  } else {
    const halfFloatExtension = gl.getExtension('OES_texture_half_float');
    supportLinearFiltering = Boolean(gl.getExtension('OES_texture_half_float_linear'));
    halfFloatTexType = halfFloatExtension?.HALF_FLOAT_OES ?? null;
  }

  if (halfFloatTexType == null) {
    return null;
  }

  let formatRGBA: SupportedFormat | null;
  let formatRG: SupportedFormat | null;
  let formatR: SupportedFormat | null;

  if (isWebGL2) {
    const webgl2 = gl as WebGL2RenderingContext;
    formatRGBA = getSupportedFormat(webgl2, webgl2.RGBA16F, webgl2.RGBA, halfFloatTexType);
    formatRG = getSupportedFormat(webgl2, webgl2.RG16F, webgl2.RG, halfFloatTexType);
    formatR = getSupportedFormat(webgl2, webgl2.R16F, webgl2.RED, halfFloatTexType);
  } else {
    formatRGBA = getSupportedFormat(gl, gl.RGBA, gl.RGBA, halfFloatTexType);
    formatRG = getSupportedFormat(gl, gl.RGBA, gl.RGBA, halfFloatTexType);
    formatR = getSupportedFormat(gl, gl.RGBA, gl.RGBA, halfFloatTexType);
  }

  if (!formatRGBA || !formatRG || !formatR) {
    return null;
  }

  gl.clearColor(0, 0, 0, 1);

  return {
    gl,
    ext: {
      formatRGBA,
      formatRG,
      formatR,
      halfFloatTexType,
      supportLinearFiltering,
    },
  };
}

function wrap(value: number, min: number, max: number) {
  const range = max - min;
  if (range === 0) {
    return min;
  }

  return ((value - min) % range) + min;
}

function hashCode(value: string) {
  if (value.length === 0) {
    return 0;
  }

  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash << 5) - hash + value.charCodeAt(i);
    hash |= 0;
  }

  return hash;
}

function scaleByPixelRatio(input: number) {
  const pixelRatio = window.devicePixelRatio || 1;
  return Math.floor(input * pixelRatio);
}

function HSVtoRGB(h: number, s: number, v: number): RGBColor {
  const i = Math.floor(h * 6);
  const f = h * 6 - i;
  const p = v * (1 - s);
  const q = v * (1 - f * s);
  const t = v * (1 - (1 - f) * s);

  switch (i % 6) {
    case 0:
      return { r: v, g: t, b: p };
    case 1:
      return { r: q, g: v, b: p };
    case 2:
      return { r: p, g: v, b: t };
    case 3:
      return { r: p, g: q, b: v };
    case 4:
      return { r: t, g: p, b: v };
    case 5:
      return { r: v, g: p, b: q };
    default:
      return { r: v, g: t, b: p };
  }
}

function hexToRGB(hex: string): RGBColor {
  let normalized = hex.replace('#', '');

  if (normalized.length === 3) {
    normalized = normalized
      .split('')
      .map((char) => char + char)
      .join('');
  }

  const r = parseInt(normalized.slice(0, 2), 16) / 255;
  const g = parseInt(normalized.slice(2, 4), 16) / 255;
  const b = parseInt(normalized.slice(4, 6), 16) / 255;

  return { r: r * 0.4, g: g * 0.4, b: b * 0.4 };
}

export default function SplashCursor({
  SIM_RESOLUTION = 128,
  DYE_RESOLUTION = 1440,
  CAPTURE_RESOLUTION = 512,
  DENSITY_DISSIPATION = 3.5,
  VELOCITY_DISSIPATION = 2,
  PRESSURE = 0.1,
  PRESSURE_ITERATIONS = 20,
  CURL = 3,
  SPLAT_RADIUS = 0.2,
  SPLAT_FORCE = 6000,
  SHADING = true,
  COLOR_UPDATE_SPEED = 10,
  BACK_COLOR = DEFAULT_BACK_COLOR,
  TRANSPARENT = true,
  RAINBOW_MODE = true,
  COLOR = '#ff0000',
}: SplashCursorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameId = useRef<number | null>(null);
  const isAppLoading = useContext(LoadingContext);

  useEffect(() => {
    if (isAppLoading) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reducedMotion) {
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    try {
      let isActive = true;
      let firstMouseMoveHandled = false;

      const config: SimulationConfig = {
        SIM_RESOLUTION,
        DYE_RESOLUTION,
        CAPTURE_RESOLUTION,
        DENSITY_DISSIPATION,
        VELOCITY_DISSIPATION,
        PRESSURE,
        PRESSURE_ITERATIONS,
        CURL,
        SPLAT_RADIUS,
        SPLAT_FORCE,
        SHADING,
        COLOR_UPDATE_SPEED,
        BACK_COLOR,
        TRANSPARENT,
        RAINBOW_MODE,
        COLOR,
        PAUSED: false,
      };

      const pointers: PointerState[] = [createPointer()];
      const context = getWebGLContext(canvas);

      if (!context) {
        return;
      }

      const { gl, ext } = context;
      if (!ext.supportLinearFiltering) {
        config.DYE_RESOLUTION = 256;
        config.SHADING = false;
      }

      const baseVertexShader = compileShader(
        gl,
        gl.VERTEX_SHADER,
        `
          precision highp float;
          attribute vec2 aPosition;
          varying vec2 vUv;
          varying vec2 vL;
          varying vec2 vR;
          varying vec2 vT;
          varying vec2 vB;
          uniform vec2 texelSize;

          void main () {
            vUv = aPosition * 0.5 + 0.5;
            vL = vUv - vec2(texelSize.x, 0.0);
            vR = vUv + vec2(texelSize.x, 0.0);
            vT = vUv + vec2(0.0, texelSize.y);
            vB = vUv - vec2(0.0, texelSize.y);
            gl_Position = vec4(aPosition, 0.0, 1.0);
          }
        `,
      );

      const copyShader = compileShader(
        gl,
        gl.FRAGMENT_SHADER,
        `
          precision mediump float;
          precision mediump sampler2D;
          varying highp vec2 vUv;
          uniform sampler2D uTexture;

          void main () {
            gl_FragColor = texture2D(uTexture, vUv);
          }
        `,
      );

      const clearShader = compileShader(
        gl,
        gl.FRAGMENT_SHADER,
        `
          precision mediump float;
          precision mediump sampler2D;
          varying highp vec2 vUv;
          uniform sampler2D uTexture;
          uniform float value;

          void main () {
            gl_FragColor = value * texture2D(uTexture, vUv);
          }
        `,
      );

      const displayShaderSource = `
        precision highp float;
        precision highp sampler2D;
        varying vec2 vUv;
        varying vec2 vL;
        varying vec2 vR;
        varying vec2 vT;
        varying vec2 vB;
        uniform sampler2D uTexture;
        uniform vec2 texelSize;

        void main () {
          vec3 c = texture2D(uTexture, vUv).rgb;
          #ifdef SHADING
            vec3 lc = texture2D(uTexture, vL).rgb;
            vec3 rc = texture2D(uTexture, vR).rgb;
            vec3 tc = texture2D(uTexture, vT).rgb;
            vec3 bc = texture2D(uTexture, vB).rgb;

            float dx = length(rc) - length(lc);
            float dy = length(tc) - length(bc);

            vec3 n = normalize(vec3(dx, dy, length(texelSize)));
            vec3 l = vec3(0.0, 0.0, 1.0);
            float diffuse = clamp(dot(n, l) + 0.7, 0.7, 1.0);
            c *= diffuse;
          #endif

          float a = max(c.r, max(c.g, c.b));
          gl_FragColor = vec4(c, a);
        }
      `;

      const splatShader = compileShader(
        gl,
        gl.FRAGMENT_SHADER,
        `
          precision highp float;
          precision highp sampler2D;
          varying vec2 vUv;
          uniform sampler2D uTarget;
          uniform float aspectRatio;
          uniform vec3 color;
          uniform vec2 point;
          uniform float radius;

          void main () {
            vec2 p = vUv - point.xy;
            p.x *= aspectRatio;
            vec3 splat = exp(-dot(p, p) / radius) * color;
            vec3 base = texture2D(uTarget, vUv).xyz;
            gl_FragColor = vec4(base + splat, 1.0);
          }
        `,
      );

      const advectionShader = compileShader(
        gl,
        gl.FRAGMENT_SHADER,
        `
          precision highp float;
          precision highp sampler2D;
          varying vec2 vUv;
          uniform sampler2D uVelocity;
          uniform sampler2D uSource;
          uniform vec2 texelSize;
          uniform vec2 dyeTexelSize;
          uniform float dt;
          uniform float dissipation;

          vec4 bilerp (sampler2D sam, vec2 uv, vec2 tsize) {
            vec2 st = uv / tsize - 0.5;
            vec2 iuv = floor(st);
            vec2 fuv = fract(st);

            vec4 a = texture2D(sam, (iuv + vec2(0.5, 0.5)) * tsize);
            vec4 b = texture2D(sam, (iuv + vec2(1.5, 0.5)) * tsize);
            vec4 c = texture2D(sam, (iuv + vec2(0.5, 1.5)) * tsize);
            vec4 d = texture2D(sam, (iuv + vec2(1.5, 1.5)) * tsize);

            return mix(mix(a, b, fuv.x), mix(c, d, fuv.x), fuv.y);
          }

          void main () {
            #ifdef MANUAL_FILTERING
              vec2 coord = vUv - dt * bilerp(uVelocity, vUv, texelSize).xy * texelSize;
              vec4 result = bilerp(uSource, coord, dyeTexelSize);
            #else
              vec2 coord = vUv - dt * texture2D(uVelocity, vUv).xy * texelSize;
              vec4 result = texture2D(uSource, coord);
            #endif

            float decay = 1.0 + dissipation * dt;
            gl_FragColor = result / decay;
          }
        `,
        ext.supportLinearFiltering ? undefined : ['MANUAL_FILTERING'],
      );

      const divergenceShader = compileShader(
        gl,
        gl.FRAGMENT_SHADER,
        `
          precision mediump float;
          precision mediump sampler2D;
          varying highp vec2 vUv;
          varying highp vec2 vL;
          varying highp vec2 vR;
          varying highp vec2 vT;
          varying highp vec2 vB;
          uniform sampler2D uVelocity;

          void main () {
            float L = texture2D(uVelocity, vL).x;
            float R = texture2D(uVelocity, vR).x;
            float T = texture2D(uVelocity, vT).y;
            float B = texture2D(uVelocity, vB).y;

            vec2 C = texture2D(uVelocity, vUv).xy;
            if (vL.x < 0.0) { L = -C.x; }
            if (vR.x > 1.0) { R = -C.x; }
            if (vT.y > 1.0) { T = -C.y; }
            if (vB.y < 0.0) { B = -C.y; }

            float div = 0.5 * (R - L + T - B);
            gl_FragColor = vec4(div, 0.0, 0.0, 1.0);
          }
        `,
      );

      const curlShader = compileShader(
        gl,
        gl.FRAGMENT_SHADER,
        `
          precision mediump float;
          precision mediump sampler2D;
          varying highp vec2 vUv;
          varying highp vec2 vL;
          varying highp vec2 vR;
          varying highp vec2 vT;
          varying highp vec2 vB;
          uniform sampler2D uVelocity;

          void main () {
            float L = texture2D(uVelocity, vL).y;
            float R = texture2D(uVelocity, vR).y;
            float T = texture2D(uVelocity, vT).x;
            float B = texture2D(uVelocity, vB).x;
            float vorticity = R - L - T + B;
            gl_FragColor = vec4(0.5 * vorticity, 0.0, 0.0, 1.0);
          }
        `,
      );

      const vorticityShader = compileShader(
        gl,
        gl.FRAGMENT_SHADER,
        `
          precision highp float;
          precision highp sampler2D;
          varying vec2 vUv;
          varying vec2 vL;
          varying vec2 vR;
          varying vec2 vT;
          varying vec2 vB;
          uniform sampler2D uVelocity;
          uniform sampler2D uCurl;
          uniform float curl;
          uniform float dt;

          void main () {
            float L = texture2D(uCurl, vL).x;
            float R = texture2D(uCurl, vR).x;
            float T = texture2D(uCurl, vT).x;
            float B = texture2D(uCurl, vB).x;
            float C = texture2D(uCurl, vUv).x;

            vec2 force = 0.5 * vec2(abs(T) - abs(B), abs(R) - abs(L));
            force /= length(force) + 0.0001;
            force *= curl * C;
            force.y *= -1.0;

            vec2 velocity = texture2D(uVelocity, vUv).xy;
            velocity += force * dt;
            velocity = min(max(velocity, -1000.0), 1000.0);
            gl_FragColor = vec4(velocity, 0.0, 1.0);
          }
        `,
      );

      const pressureShader = compileShader(
        gl,
        gl.FRAGMENT_SHADER,
        `
          precision mediump float;
          precision mediump sampler2D;
          varying highp vec2 vUv;
          varying highp vec2 vL;
          varying highp vec2 vR;
          varying highp vec2 vT;
          varying highp vec2 vB;
          uniform sampler2D uPressure;
          uniform sampler2D uDivergence;

          void main () {
            float L = texture2D(uPressure, vL).x;
            float R = texture2D(uPressure, vR).x;
            float T = texture2D(uPressure, vT).x;
            float B = texture2D(uPressure, vB).x;
            float C = texture2D(uPressure, vUv).x;
            float divergence = texture2D(uDivergence, vUv).x;
            float pressure = (L + R + B + T - divergence) * 0.25;
            gl_FragColor = vec4(pressure, 0.0, 0.0, 1.0);
          }
        `,
      );

      const gradientSubtractShader = compileShader(
        gl,
        gl.FRAGMENT_SHADER,
        `
          precision mediump float;
          precision mediump sampler2D;
          varying highp vec2 vUv;
          varying highp vec2 vL;
          varying highp vec2 vR;
          varying highp vec2 vT;
          varying highp vec2 vB;
          uniform sampler2D uPressure;
          uniform sampler2D uVelocity;

          void main () {
            float L = texture2D(uPressure, vL).x;
            float R = texture2D(uPressure, vR).x;
            float T = texture2D(uPressure, vT).x;
            float B = texture2D(uPressure, vB).x;
            vec2 velocity = texture2D(uVelocity, vUv).xy;
            velocity -= vec2(R - L, T - B);
            gl_FragColor = vec4(velocity, 0.0, 1.0);
          }
        `,
      );

      gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, -1, 1, 1, 1, 1, -1]), gl.STATIC_DRAW);
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, gl.createBuffer());
      gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array([0, 1, 2, 0, 2, 3]), gl.STATIC_DRAW);
      gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
      gl.enableVertexAttribArray(0);

      const blit = (target: SingleFBO | null, clear = false) => {
        if (target == null) {
          gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
          gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        } else {
          gl.viewport(0, 0, target.width, target.height);
          gl.bindFramebuffer(gl.FRAMEBUFFER, target.fbo);
        }

        if (clear) {
          gl.clearColor(0, 0, 0, 1);
          gl.clear(gl.COLOR_BUFFER_BIT);
        }

        gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);
      };

      const copyProgram = new Program(gl, baseVertexShader, copyShader);
      const clearProgram = new Program(gl, baseVertexShader, clearShader);
      const splatProgram = new Program(gl, baseVertexShader, splatShader);
      const advectionProgram = new Program(gl, baseVertexShader, advectionShader);
      const divergenceProgram = new Program(gl, baseVertexShader, divergenceShader);
      const curlProgram = new Program(gl, baseVertexShader, curlShader);
      const vorticityProgram = new Program(gl, baseVertexShader, vorticityShader);
      const pressureProgram = new Program(gl, baseVertexShader, pressureShader);
      const gradientSubtractProgram = new Program(gl, baseVertexShader, gradientSubtractShader);
      const displayMaterial = new Material(gl, baseVertexShader, displayShaderSource);

      let dye: DoubleFBO | null = null;
      let velocity: DoubleFBO | null = null;
      let divergence: SingleFBO | null = null;
      let curl: SingleFBO | null = null;
      let pressure: DoubleFBO | null = null;

      const createFBO = (
        width: number,
        height: number,
        internalFormat: number,
        format: number,
        type: number,
        param: number,
      ): SingleFBO => {
        const texture = gl.createTexture();
        const framebuffer = gl.createFramebuffer();

        if (!texture || !framebuffer) {
          throw new Error('Unable to allocate framebuffer resources.');
        }

        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, param);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, param);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texImage2D(gl.TEXTURE_2D, 0, internalFormat, width, height, 0, format, type, null);

        gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
        gl.viewport(0, 0, width, height);
        gl.clear(gl.COLOR_BUFFER_BIT);

        return {
          texture,
          fbo: framebuffer,
          width,
          height,
          texelSizeX: 1 / width,
          texelSizeY: 1 / height,
          attach(id: number) {
            gl.activeTexture(gl.TEXTURE0 + id);
            gl.bindTexture(gl.TEXTURE_2D, texture);
            return id;
          },
        };
      };

      const createDoubleFBO = (
        width: number,
        height: number,
        internalFormat: number,
        format: number,
        type: number,
        param: number,
      ): DoubleFBO => {
        let first = createFBO(width, height, internalFormat, format, type, param);
        let second = createFBO(width, height, internalFormat, format, type, param);

        return {
          width,
          height,
          texelSizeX: first.texelSizeX,
          texelSizeY: first.texelSizeY,
          get read() {
            return first;
          },
          set read(value: SingleFBO) {
            first = value;
          },
          get write() {
            return second;
          },
          set write(value: SingleFBO) {
            second = value;
          },
          swap() {
            const temp = first;
            first = second;
            second = temp;
          },
        };
      };

      const resizeFBO = (
        target: SingleFBO,
        width: number,
        height: number,
        internalFormat: number,
        format: number,
        type: number,
        param: number,
      ) => {
        const next = createFBO(width, height, internalFormat, format, type, param);
        copyProgram.bind();
        gl.uniform1i(copyProgram.uniforms.uTexture, target.attach(0));
        blit(next);
        return next;
      };

      const resizeDoubleFBO = (
        target: DoubleFBO,
        width: number,
        height: number,
        internalFormat: number,
        format: number,
        type: number,
        param: number,
      ) => {
        if (target.width === width && target.height === height) {
          return target;
        }

        target.read = resizeFBO(target.read, width, height, internalFormat, format, type, param);
        target.write = createFBO(width, height, internalFormat, format, type, param);
        target.width = width;
        target.height = height;
        target.texelSizeX = 1 / width;
        target.texelSizeY = 1 / height;
        return target;
      };

      const getResolution = (resolution: number) => {
        let aspectRatio = gl.drawingBufferWidth / gl.drawingBufferHeight;
        if (aspectRatio < 1) {
          aspectRatio = 1 / aspectRatio;
        }

        const min = Math.round(resolution);
        const max = Math.round(resolution * aspectRatio);

        if (gl.drawingBufferWidth > gl.drawingBufferHeight) {
          return { width: max, height: min };
        }

        return { width: min, height: max };
      };

      const initFramebuffers = () => {
        const simRes = getResolution(config.SIM_RESOLUTION);
        const dyeRes = getResolution(config.DYE_RESOLUTION);
        const texType = ext.halfFloatTexType;
        const rgba = ext.formatRGBA;
        const rg = ext.formatRG;
        const r = ext.formatR;
        const filtering = ext.supportLinearFiltering ? gl.LINEAR : gl.NEAREST;

        gl.disable(gl.BLEND);

        dye = dye
          ? resizeDoubleFBO(dye, dyeRes.width, dyeRes.height, rgba.internalFormat, rgba.format, texType, filtering)
          : createDoubleFBO(dyeRes.width, dyeRes.height, rgba.internalFormat, rgba.format, texType, filtering);

        velocity = velocity
          ? resizeDoubleFBO(
              velocity,
              simRes.width,
              simRes.height,
              rg.internalFormat,
              rg.format,
              texType,
              filtering,
            )
          : createDoubleFBO(simRes.width, simRes.height, rg.internalFormat, rg.format, texType, filtering);

        divergence = createFBO(simRes.width, simRes.height, r.internalFormat, r.format, texType, gl.NEAREST);
        curl = createFBO(simRes.width, simRes.height, r.internalFormat, r.format, texType, gl.NEAREST);
        pressure = createDoubleFBO(simRes.width, simRes.height, r.internalFormat, r.format, texType, gl.NEAREST);
      };

      const updateKeywords = () => {
        const displayKeywords: string[] = [];
        if (config.SHADING) {
          displayKeywords.push('SHADING');
        }
        displayMaterial.setKeywords(displayKeywords);
      };

      const resizeCanvas = () => {
        const width = scaleByPixelRatio(canvas.clientWidth);
        const height = scaleByPixelRatio(canvas.clientHeight);

        if (canvas.width !== width || canvas.height !== height) {
          canvas.width = width;
          canvas.height = height;
          return true;
        }

        return false;
      };

      const correctRadius = (radius: number) => {
        let aspectRatio = canvas.width / canvas.height;
        if (aspectRatio > 1) {
          aspectRatio *= radius;
          return aspectRatio;
        }
        return radius;
      };

      const correctDeltaX = (delta: number) => {
        const aspectRatio = canvas.width / canvas.height;
        if (aspectRatio < 1) {
          return delta * aspectRatio;
        }
        return delta;
      };

      const correctDeltaY = (delta: number) => {
        const aspectRatio = canvas.width / canvas.height;
        if (aspectRatio > 1) {
          return delta / aspectRatio;
        }
        return delta;
      };

      const generateColor = () => {
        if (!config.RAINBOW_MODE) {
          return hexToRGB(config.COLOR);
        }

        const color = HSVtoRGB(Math.random(), 1, 1);
        return {
          r: color.r * 0.4,
          g: color.g * 0.4,
          b: color.b * 0.4,
        };
      };

      const splat = (x: number, y: number, dx: number, dy: number, color: RGBColor) => {
        if (!velocity || !dye) {
          return;
        }

        splatProgram.bind();
        gl.uniform1i(splatProgram.uniforms.uTarget, velocity.read.attach(0));
        gl.uniform1f(splatProgram.uniforms.aspectRatio, canvas.width / canvas.height);
        gl.uniform2f(splatProgram.uniforms.point, x, y);
        gl.uniform3f(splatProgram.uniforms.color, dx, dy, 0);
        gl.uniform1f(splatProgram.uniforms.radius, correctRadius(config.SPLAT_RADIUS / 100));
        blit(velocity.write);
        velocity.swap();

        gl.uniform1i(splatProgram.uniforms.uTarget, dye.read.attach(0));
        gl.uniform3f(splatProgram.uniforms.color, color.r, color.g, color.b);
        blit(dye.write);
        dye.swap();
      };

      const splatPointer = (pointer: PointerState) => {
        splat(
          pointer.texcoordX,
          pointer.texcoordY,
          pointer.deltaX * config.SPLAT_FORCE,
          pointer.deltaY * config.SPLAT_FORCE,
          pointer.color,
        );
      };

      const clickSplat = (pointer: PointerState) => {
        const color = generateColor();
        splat(
          pointer.texcoordX,
          pointer.texcoordY,
          10 * (Math.random() - 0.5),
          30 * (Math.random() - 0.5),
          {
            r: color.r * 10,
            g: color.g * 10,
            b: color.b * 10,
          },
        );
      };

      const updatePointerDownData = (pointer: PointerState, id: number, posX: number, posY: number) => {
        pointer.id = id;
        pointer.down = true;
        pointer.moved = false;
        pointer.texcoordX = posX / canvas.width;
        pointer.texcoordY = 1 - posY / canvas.height;
        pointer.prevTexcoordX = pointer.texcoordX;
        pointer.prevTexcoordY = pointer.texcoordY;
        pointer.deltaX = 0;
        pointer.deltaY = 0;
        pointer.color = generateColor();
      };

      const updatePointerMoveData = (
        pointer: PointerState,
        posX: number,
        posY: number,
        color: RGBColor,
      ) => {
        pointer.prevTexcoordX = pointer.texcoordX;
        pointer.prevTexcoordY = pointer.texcoordY;
        pointer.texcoordX = posX / canvas.width;
        pointer.texcoordY = 1 - posY / canvas.height;
        pointer.deltaX = correctDeltaX(pointer.texcoordX - pointer.prevTexcoordX);
        pointer.deltaY = correctDeltaY(pointer.texcoordY - pointer.prevTexcoordY);
        pointer.moved = Math.abs(pointer.deltaX) > 0 || Math.abs(pointer.deltaY) > 0;
        pointer.color = color;
      };

      const updatePointerUpData = (pointer: PointerState) => {
        pointer.down = false;
      };

      let lastUpdateTime = Date.now();
      let colorUpdateTimer = 0;

      const calcDeltaTime = () => {
        const now = Date.now();
        let delta = (now - lastUpdateTime) / 1000;
        delta = Math.min(delta, 0.016666);
        lastUpdateTime = now;
        return delta;
      };

      const updateColors = (delta: number) => {
        colorUpdateTimer += delta * config.COLOR_UPDATE_SPEED;
        if (colorUpdateTimer >= 1) {
          colorUpdateTimer = wrap(colorUpdateTimer, 0, 1);
          pointers.forEach((pointer) => {
            pointer.color = generateColor();
          });
        }
      };

      const applyInputs = () => {
        pointers.forEach((pointer) => {
          if (!pointer.moved) {
            return;
          }

          pointer.moved = false;
          splatPointer(pointer);
        });
      };

      const drawDisplay = (target: SingleFBO | null) => {
        const width = target == null ? gl.drawingBufferWidth : target.width;
        const height = target == null ? gl.drawingBufferHeight : target.height;

        displayMaterial.bind();
        if (config.SHADING) {
          gl.uniform2f(displayMaterial.uniforms.texelSize, 1 / width, 1 / height);
        }
        gl.uniform1i(displayMaterial.uniforms.uTexture, dye!.read.attach(0));
        blit(target);
      };

      const render = (target: SingleFBO | null) => {
        gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
        gl.enable(gl.BLEND);
        drawDisplay(target);
      };

      const step = (delta: number) => {
        if (!velocity || !curl || !divergence || !pressure || !dye) {
          return;
        }

        gl.disable(gl.BLEND);

        curlProgram.bind();
        gl.uniform2f(curlProgram.uniforms.texelSize, velocity.texelSizeX, velocity.texelSizeY);
        gl.uniform1i(curlProgram.uniforms.uVelocity, velocity.read.attach(0));
        blit(curl);

        vorticityProgram.bind();
        gl.uniform2f(vorticityProgram.uniforms.texelSize, velocity.texelSizeX, velocity.texelSizeY);
        gl.uniform1i(vorticityProgram.uniforms.uVelocity, velocity.read.attach(0));
        gl.uniform1i(vorticityProgram.uniforms.uCurl, curl.attach(1));
        gl.uniform1f(vorticityProgram.uniforms.curl, config.CURL);
        gl.uniform1f(vorticityProgram.uniforms.dt, delta);
        blit(velocity.write);
        velocity.swap();

        divergenceProgram.bind();
        gl.uniform2f(divergenceProgram.uniforms.texelSize, velocity.texelSizeX, velocity.texelSizeY);
        gl.uniform1i(divergenceProgram.uniforms.uVelocity, velocity.read.attach(0));
        blit(divergence);

        clearProgram.bind();
        gl.uniform1i(clearProgram.uniforms.uTexture, pressure.read.attach(0));
        gl.uniform1f(clearProgram.uniforms.value, config.PRESSURE);
        blit(pressure.write);
        pressure.swap();

        pressureProgram.bind();
        gl.uniform2f(pressureProgram.uniforms.texelSize, velocity.texelSizeX, velocity.texelSizeY);
        gl.uniform1i(pressureProgram.uniforms.uDivergence, divergence.attach(0));
        for (let i = 0; i < config.PRESSURE_ITERATIONS; i += 1) {
          gl.uniform1i(pressureProgram.uniforms.uPressure, pressure.read.attach(1));
          blit(pressure.write);
          pressure.swap();
        }

        gradientSubtractProgram.bind();
        gl.uniform2f(
          gradientSubtractProgram.uniforms.texelSize,
          velocity.texelSizeX,
          velocity.texelSizeY,
        );
        gl.uniform1i(gradientSubtractProgram.uniforms.uPressure, pressure.read.attach(0));
        gl.uniform1i(gradientSubtractProgram.uniforms.uVelocity, velocity.read.attach(1));
        blit(velocity.write);
        velocity.swap();

        advectionProgram.bind();
        gl.uniform2f(advectionProgram.uniforms.texelSize, velocity.texelSizeX, velocity.texelSizeY);
        if (!ext.supportLinearFiltering) {
          gl.uniform2f(advectionProgram.uniforms.dyeTexelSize, velocity.texelSizeX, velocity.texelSizeY);
        }

        const velocityId = velocity.read.attach(0);
        gl.uniform1i(advectionProgram.uniforms.uVelocity, velocityId);
        gl.uniform1i(advectionProgram.uniforms.uSource, velocityId);
        gl.uniform1f(advectionProgram.uniforms.dt, delta);
        gl.uniform1f(advectionProgram.uniforms.dissipation, config.VELOCITY_DISSIPATION);
        blit(velocity.write);
        velocity.swap();

        if (!ext.supportLinearFiltering) {
          gl.uniform2f(advectionProgram.uniforms.dyeTexelSize, dye.texelSizeX, dye.texelSizeY);
        }
        gl.uniform1i(advectionProgram.uniforms.uVelocity, velocity.read.attach(0));
        gl.uniform1i(advectionProgram.uniforms.uSource, dye.read.attach(1));
        gl.uniform1f(advectionProgram.uniforms.dissipation, config.DENSITY_DISSIPATION);
        blit(dye.write);
        dye.swap();
      };

      const updateFrame = () => {
        if (!isActive) {
          return;
        }

        const delta = calcDeltaTime();
        if (resizeCanvas()) {
          initFramebuffers();
        }

        updateColors(delta);
        applyInputs();
        step(delta);
        render(null);
        animationFrameId.current = window.requestAnimationFrame(updateFrame);
      };

      const handleMouseDown = (event: MouseEvent) => {
        const pointer = pointers[0];
        const posX = scaleByPixelRatio(event.clientX);
        const posY = scaleByPixelRatio(event.clientY);
        updatePointerDownData(pointer, -1, posX, posY);
        clickSplat(pointer);
      };

      const handleMouseMove = (event: MouseEvent) => {
        const pointer = pointers[0];
        const posX = scaleByPixelRatio(event.clientX);
        const posY = scaleByPixelRatio(event.clientY);

        if (!firstMouseMoveHandled) {
          updatePointerMoveData(pointer, posX, posY, generateColor());
          firstMouseMoveHandled = true;
          return;
        }

        updatePointerMoveData(pointer, posX, posY, pointer.color);
      };

      const handleTouchStart = (event: TouchEvent) => {
        const pointer = pointers[0];
        for (const touch of Array.from(event.targetTouches)) {
          const posX = scaleByPixelRatio(touch.clientX);
          const posY = scaleByPixelRatio(touch.clientY);
          updatePointerDownData(pointer, touch.identifier, posX, posY);
        }
      };

      const handleTouchMove = (event: TouchEvent) => {
        const pointer = pointers[0];
        for (const touch of Array.from(event.targetTouches)) {
          const posX = scaleByPixelRatio(touch.clientX);
          const posY = scaleByPixelRatio(touch.clientY);
          updatePointerMoveData(pointer, posX, posY, pointer.color);
        }
      };

      const handleTouchEnd = (event: TouchEvent) => {
        const pointer = pointers[0];
        if (event.changedTouches.length > 0) {
          updatePointerUpData(pointer);
        }
      };

      updateKeywords();
      initFramebuffers();
      updateFrame();

      window.addEventListener('mousedown', handleMouseDown);
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('touchstart', handleTouchStart);
      window.addEventListener('touchmove', handleTouchMove);
      window.addEventListener('touchend', handleTouchEnd);

      return () => {
        isActive = false;

        if (animationFrameId.current != null) {
          window.cancelAnimationFrame(animationFrameId.current);
          animationFrameId.current = null;
        }

        window.removeEventListener('mousedown', handleMouseDown);
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('touchstart', handleTouchStart);
        window.removeEventListener('touchmove', handleTouchMove);
        window.removeEventListener('touchend', handleTouchEnd);
      };
    } catch (error) {
      console.error('SplashCursor failed to initialize:', error);
      return;
    }
  }, [
    isAppLoading,
    BACK_COLOR,
    CAPTURE_RESOLUTION,
    COLOR,
    COLOR_UPDATE_SPEED,
    CURL,
    DENSITY_DISSIPATION,
    DYE_RESOLUTION,
    PRESSURE,
    PRESSURE_ITERATIONS,
    RAINBOW_MODE,
    SHADING,
    SIM_RESOLUTION,
    SPLAT_FORCE,
    SPLAT_RADIUS,
    TRANSPARENT,
    VELOCITY_DISSIPATION,
  ]);

  if (isAppLoading) return null;

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[9999] overflow-hidden">
      <canvas ref={canvasRef} className="block h-full w-full opacity-90" />
    </div>
  );
}
