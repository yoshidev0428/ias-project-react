const fs = `\
precision highp float;

uniform mat3 kernel;
uniform float brightness;
uniform float contrast;
uniform float gamma;

vec4 brightnessContrastGamma(vec4 color) {
  color.rgb += brightness;
  if (contrast > 0.0) {
    color.rgb = (color.rgb - 0.5) / (1.0 - contrast) + 0.5;
  } else {
    color.rgb = (color.rgb - 0.5) * (1.0 + contrast) + 0.5;
  }
  color.rgb = pow(color.rgb, vec3(gamma / 50.0));
  return color;
}

vec4 viv_sampleColor(sampler2D texture, vec2 texSize, vec2 texCoord) {
  vec4 color = vec4(0.0);
  vec3 sum = vec3(0.0);

  for (int i = -1; i <= 1; i++) {
    for (int j = -1; j <= 1; j++) {
      vec2 offset = vec2(float(i), float(j));
      sum += texture2D(texture, texCoord + offset).rgb * kernel[i+1][j+1];
    }
  }
  color = vec4(sum, 1.0);
  return brightnessContrastGamma(color);
}
`;

const uniforms = {
  brightness: { value: 0, min: -1, max: 1 },
  contrast: { value: 0, min: -1, max: 1 },
  gamma: { value: 50, min: 0, max: 100 },
  kernel: [0.0, -1.0, 0.0, -1.0, 4.0, -1.0, 0.0, -1.0, 0.0],
};

const vivShaderModule = {
  name: 'viv',
  uniforms,
  fs,
  passes: [{ sampler: true }],
};

export default vivShaderModule;
