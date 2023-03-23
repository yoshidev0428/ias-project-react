
const fs = (bound, iterNum) => `
#pragma glslify: cannyEdgeDetection = require(glsl-canny-edge-detection);
#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 uResolution;
vec4 viv_sampleColor(sampler2D texture, vec2 texSize, vec2 texCoord) {
  vec3 color = vec3(0.0);
  if (${bound} <=0 ){
    
    float edge = cannyEdgeDetection(
      texture, texCoord, uResolution, 10., 50.);
    color = vec3(edge);


vec4 brightnessContrastGamma(vec4 color) {
  color.rgb += u_brightness;
  if (u_contrast > 0.0) {
    color.rgb = (color.rgb - 0.5) / (1.0 - u_contrast) + 0.5;
  } else {
    color.rgb = (color.rgb - 0.5) * (1.0 + u_contrast) + 0.5;
  }
  color.rgb = pow(color.rgb, vec3(u_gamma / 50.0));
  return color;
}

  return brightnessContrastGamma(color);
}

`;

const uniforms = {
  u_brightness: { value: 0, min: -1, max: 1 },
  u_contrast: { value: 0, min: -1, max: 1 },
  u_gamma: { value: 50, min: 0, max: 100 },
  u_deblurKernel: [],
  u_Slice: [0, 0],
  u_target: [0, 0],  
  u_zoom: 1.,
  canWH: [634., 594.],
  disWH: [791., 744.],
};

const generateShaderModule = (bound, iterNum) => ({
  name: 'viv',
  uniforms,
  fs: fs(bound, iterNum),
  passes: [{ sampler: true }],
});

export default generateShaderModule;