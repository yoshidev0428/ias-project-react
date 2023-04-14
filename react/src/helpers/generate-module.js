// var glsl = require('glslify')
const fs = (bound, index) => `
#ifdef GL_ES
precision highp float;
#endif
const float PI = 3.14159265359;
uniform float u_deblurKernel[49];
uniform float u_Slice[2];
uniform float u_target[2];
uniform float canWH[2];
uniform float disWH[2];

uniform float u_zoom;
uniform float u_brightness;
uniform float u_contrast;
uniform float u_gamma;
uniform float u_iterNum[2];
uniform vec2 uResolution;
uniform float uWeakThreshold;
uniform float uStrongThreshold;


float scale = pow(2., u_zoom);
float ratioX = canWH[0]/disWH[0];
float ratioY = canWH[1]/disWH[1];
float kx = ratioX * scale;
float ky = ratioY * scale;

float changedX = (u_target[0] - u_Slice[0]/2.)*kx;
float changedY = (u_target[1] - u_Slice[1]/2.)*ky;

float cx = canWH[0]/2. - changedX;
float cy = canWH[1]/2. + changedY;

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
///////////////////////
#define GLSLIFY 1
vec4 blur5(sampler2D image, vec2 uv, vec2 resolution, vec2 direction) {
  vec4 color = vec4(0.0);
  vec2 off1 = vec2(1.3333333333333333) * direction;
  color += texture2D(image, uv) * 0.29411764705882354;
  color += texture2D(image, uv + (off1 / resolution)) * 0.35294117647058826;
  color += texture2D(image, uv - (off1 / resolution)) * 0.35294117647058826;
  return color; 
}

const mat3 X_COMPONENT_MATRIX_2281831123 = mat3(1., 0., -1., 2., 0., -2., 1., 0., -1.);
const mat3 Y_COMPONENT_MATRIX_2281831123 = mat3(1., 2., 1., 0., 0., 0., -1., -2., -1.);

/**
 * 3x3 Matrix convolution
 */
float convoluteMatrices(mat3 A, mat3 B) {
  return dot(A[0], B[0]) + dot(A[1], B[1]) + dot(A[2], B[2]);
}

/**
 * Get the color of a texture after
 * a Guassian blur with a radius of 5 pixels
 */
vec3 getBlurredTextureColor(
  sampler2D textureSampler,
  vec2 textureCoord,
  vec2 resolution
) {
  return blur5(
    textureSampler,
    textureCoord,
    resolution,
    normalize(textureCoord - vec2(0.5))).xyz;
}

/**
 * Get the intensity of the color on a
 * texture after a guassian blur is applied
 */
float getTextureIntensity(
  sampler2D textureSampler,
  vec2 textureCoord,
  vec2 resolution
) {
  vec3 color = getBlurredTextureColor(textureSampler, textureCoord, resolution);
  return pow(length(clamp(color, vec3(0.), vec3(1.))), 2.) / 3.;
}

/**
 * Get the gradient of the textures intensity
 * as a function of the texture coordinate
 */
vec2 getTextureIntensityGradient(
  sampler2D textureSampler,
  vec2 textureCoord,
  vec2 resolution
) {
  vec2 gradientStep = vec2(1.) / resolution;

  mat3 imgMat = mat3(0.);

  for (int i = 0; i < 3; i++) {
    for (int j = 0; j < 3; j++) {
      vec2 ds = vec2(
        -gradientStep.x + (float(i) * gradientStep.x),
        -gradientStep.y + (float(j) * gradientStep.y));
      imgMat[i][j] = getTextureIntensity(
        textureSampler, clamp(textureCoord + ds, vec2(0.), vec2(1.)), resolution);
    }
  }

  float gradX = convoluteMatrices(X_COMPONENT_MATRIX_2281831123, imgMat);
  float gradY = convoluteMatrices(Y_COMPONENT_MATRIX_2281831123, imgMat);

  return vec2(gradX, gradY);
}

// const float PI = 3.14159265359;

/**
 * Rotate a 2D vector an angle (in degrees)
 */
vec2 rotate2D(vec2 v, float rad) {
  float s = sin(rad);
  float c = cos(rad);
  return mat2(c, s, -s, c) * v;
}

/**
 * Return a vector with the same length as v
 * but its direction is rounded to the nearest
 * of 8 cardinal directions
 */
vec2 round2DVectorAngle(vec2 v) {
  float len = length(v);
  vec2 n = normalize(v);
  float maximum = -1.;
  float bestAngle;
  for (int i = 0; i < 8; i++) {
    float theta = (float(i) * 2. * PI) / 8.;
    vec2 u = rotate2D(vec2(1., 0.), theta);
    float scalarProduct = dot(u, n);
    if (scalarProduct > maximum) {
      bestAngle = theta;
      maximum = scalarProduct;
    }
  }
  return len * rotate2D(vec2(1., 0.), bestAngle);
}

/**
 * Get the texture intensity gradient of an image
 * where the angle of the direction is rounded to
 * one of the 8 cardinal directions and gradients
 * that are not local extrema are zeroed out
 */
vec2 getSuppressedTextureIntensityGradient(
  sampler2D textureSampler,
  vec2 textureCoord,
  vec2 resolution
) {
  vec2 gradient = getTextureIntensityGradient(textureSampler, textureCoord, resolution);
  gradient = round2DVectorAngle(gradient);
  vec2 gradientStep = normalize(gradient) / resolution;
  float gradientLength = length(gradient);
  vec2 gradientPlusStep = getTextureIntensityGradient(
    textureSampler, textureCoord + gradientStep, resolution);
  if (length(gradientPlusStep) >= gradientLength) return vec2(0.);
  vec2 gradientMinusStep = getTextureIntensityGradient(
    textureSampler, textureCoord - gradientStep, resolution);
  if (length(gradientMinusStep) >= gradientLength) return vec2(0.);
  return gradient;
}

/**
 * Apply a double threshold to each edge to classify each edge
 * as a weak edge or a strong edge
 */
float applyDoubleThreshold(
  vec2 gradient,
  float weakThreshold,
  float strongThreshold
) {
  float gradientLength = length(gradient);
  if (gradientLength < weakThreshold) return 0.;
  if (gradientLength < strongThreshold) return .5;
  return 1.;
}

float applyHysteresis(
  sampler2D textureSampler,
  vec2 textureCoord,
  vec2 resolution,
  float weakThreshold,
  float strongThreshold
) {
  float dx = 1. / resolution.x;
  float dy = 1. / resolution.y;
  for (int i = 0; i < 3; i++) {
    for (int j = 0; j < 3; j++) {
      vec2 ds = vec2(
        -dx + (float(i) * dx),
        -dy + (float(j) * dy));
      vec2 gradient = getSuppressedTextureIntensityGradient(
        textureSampler, clamp(textureCoord + ds, vec2(0.), vec2(1.)), resolution);
      float edge = applyDoubleThreshold(gradient, weakThreshold, strongThreshold);
      if (edge == 1.) return 1.;
    }
  }
  return 0.;
}

float cannyEdgeDetection(
  sampler2D textureSampler,
  vec2 textureCoord,
  vec2 resolution,
  float weakThreshold,
  float strongThreshold
) {
  vec2 gradient = getSuppressedTextureIntensityGradient(textureSampler, textureCoord, resolution);
  float edge = applyDoubleThreshold(gradient, weakThreshold, strongThreshold);
  if (edge == .5) {
    edge = applyHysteresis(
      textureSampler, textureCoord, resolution, weakThreshold, strongThreshold);
  }
  return edge;
}

vec3 erode(
  sampler2D texture,
  vec2 texCoord,
  vec2 texSize
) {
  vec3 sum = vec3(1.);
  for (int i = -${bound}; i <= ${bound}; i++) {
    for (int j = -${bound}; j <= ${bound}; j++) {
      vec2 onePixel = vec2(1) / texSize;
      vec2 offset = vec2(float(j), float(i));
      sum = min(sum, texture2D(texture, texCoord + onePixel*offset).rgb);
    }
  }
  return sum;
}

vec3 dilate(
  sampler2D texture,
  vec2 texCoord,
  vec2 texSize
) {
  vec3 sum = vec3(0.);
  for (int i = -${bound}; i <= ${bound}; i++) {
    for (int j = -${bound}; j <= ${bound}; j++) {
      vec2 onePixel = vec2(1) / texSize;
      vec2 offset = vec2(float(j), float(i));
      sum = max(sum, texture2D(texture, texCoord + onePixel*offset).rgb);
    }
  }
  return sum;
}
vec3 gabor(sampler2D texture, vec2 texCoord) {
  float lambda = 12.5;
  float theta = 12.;
  float sigma = 10.;
  float gamma = 6.7;
  float x = texCoord.x * cos(theta) + texCoord.y * sin(theta);
  float y = -texCoord.x * sin(theta) + texCoord.y * cos(theta);
  float gauss = exp(-(x*x + y*y)/(2.0 * sigma * sigma));
  vec4 color = texture2D(texture, texCoord);
  float gabor = color.r * gauss * sin(2. * 3.14 * x / lambda) * pow(gamma, 2.);
  return vec3(gabor);

}
vec3 dicRestore(sampler2D texture, vec2 texCoord) {

  vec3 ic = texture2D(texture, texCoord).rgb;
  // vec3 dic = sin(0.2*3.141592653589793*c);
  float density = (ic.r + ic.g + ic.b - 1.0) / 3.0;
  return vec3(density);
}
vec3 TopHat(sampler2D texture, vec2 texCoord, vec2 texSize) {
  const int radius = 1;
  vec3 sum = vec3(0.0);
  for (int x = -radius; x <= radius; x++)
  {
      for (int y = -radius; y <= radius; y++)
      {
        vec2 onePixel = vec2(1) / texSize;
        vec2 offset = vec2(float(x), float(y));
        vec3 color = texture2D(texture, texCoord + offset*onePixel).rgb;
        sum += color;
      }
  }
  sum = sum/float(radius*radius);
  vec3 center = texture2D(texture, texCoord).rgb;
  return center + (sum - (float(radius)*float(radius) + 1.0) * center);
}
vec3 varianceFun(sampler2D texture, vec2 texCoord, vec2 texSize){
  vec3 color = vec3(0.0);
  float variance = 0.0;
  //Loop through the neighbour pixels
  for (int y = -1; y <= 1; y++)
  {
    for (int x = -1; x <= 1; x++)
    {
      vec2 onePixel = vec2(1) / texSize;
      vec2 offset = vec2(float(x), float(y));
      vec4 neighbourColor = texture(texture, texCoord + onePixel*offset);

      //Calculate the variance of neighbouring pixels
      variance += (neighbourColor.r - color.r) * (neighbourColor.r - color.r);
      variance += (neighbourColor.g - color.g) * (neighbourColor.g - color.g);
      variance += (neighbourColor.b - color.b) * (neighbourColor.b - color.b);
    }
  }
  variance /= 27.0; //Divide by 27 to normalize

  //Compare the variance to the threshold
  if (variance > 0.7)
  {
    color = vec3(1.);
  }

  return color;

}
vec3 Pruning(sampler2D texture, vec2 texCoord) {
  vec3 sum = vec3(0.0);
  // Find the relative coordinates of each pixel with respect to the 
  // center of the filter
  const float size = 1.;
  for (float x = -size; x <= size; x++)
  {
    for (float y = -size; y <= size; y++)
    {
        // Get the pixel value from the image
        vec3 pixel = texture2D(texture, texCoord).rgb;

        // If the pixel value is greater than the threshold,
        // add it to the sum
        if (length(pixel) > 0.8)
        {
            sum += pixel;
        }
    }
  }
  return sum;  
}
vec3 Thinning(sampler2D texture, vec2 texCoord, vec2 texSize) {
  vec2 onePixel = vec2(1.0, 1.0) / texSize;
  // vec2 texCoord = gl_FragCoord.xy / texSize;
  vec4 cc = texture2D(texture, texCoord);   
  float theta = degrees(cc.y*PI*2.0); 
  int ax = 0, ay = 0; 
  if ((theta >= 337.5) || (theta < 22.5)) { ax = 1; ay = 0; } 
  else if ((theta >= 22.5) && (theta < 67.5)) { ax = 1; ay = 1; } 
  else if ((theta >= 67.5) && (theta < 112.5)) { ax = 0; ay = 1; } 
  else if ((theta >= 112.5) && (theta < 157.5)) { ax =-1; ay = 1; } 
  else if ((theta >= 157.5) && (theta < 202.5)) { ax =-1; ay = 0; } 
  else if ((theta >=202.5) && (theta < 247.5)) { ax =-1; ay =-1; } 
  else if ((theta >=247.5) && (theta < 292.5)) { ax = 0; ay =-1; } 
  else if ((theta >= 292.5) && (theta < 337.5)) { ax = 1; ay =-1; }

  vec4 ca = texture2D(texture, texCoord + onePixel*vec2(ax, ay));
  vec4 cb = texture2D(texture, texCoord + onePixel*vec2(-ax, -ay));
  vec4 sum = vec4((((cc.x <= ca.x) || (cc.x < cb.x)) ? vec3(0) : vec3(cc.x)), 1.0);  
  return sum.rgb;

}
vec3 local_equalizer(sampler2D texture, vec2 texCoord, vec2 texSize) {
  vec2 onePixel = vec2(1) / texSize;
  vec2 midPoint = vec2(float(1), float(1));
  vec3 cfd = vec3(0.);
  vec3 midColor = texture2D(texture, texCoord + onePixel*midPoint).rgb;
  for (int i = -1; i <= 1; i++) {
    for (int j = -1; j <= 1; j++) {
      
      vec2 offset = vec2(float(j), float(i));
      if (texture2D(texture, texCoord + onePixel*offset).r <= midColor.r) {
        cfd.r = cfd.r + 1./9.;
      }
      if (texture2D(texture, texCoord + onePixel*offset).g <= midColor.g) {
        cfd.g = cfd.g + 1./9.;
      }
      if (texture2D(texture, texCoord + onePixel*offset).b <= midColor.b) {
        cfd.b = cfd.b + 1./9.;
      }                
    }
  }
  return cfd;
}
vec3 colorChange(
  sampler2D texture,
  vec2 texCoord,
  vec2 texSize,
  vec2 u_Resolution,
  float u_WeakThreshold,
  float u_StrongThreshold
) {
    vec3 sum = vec3(0.85);
    if (gl_FragCoord.x > cx-u_Slice[0]/2.*ky && gl_FragCoord.x < cx+u_Slice[0]/2.*ky && gl_FragCoord.y > cy -u_Slice[1]/2.*ky && gl_FragCoord.y < cy+u_Slice[1]/2.*ky){
      if (${index} == 6) {
        sum = local_equalizer(texture, texCoord, texSize);
      } else if (${index} == 19) {
        float edge = cannyEdgeDetection(
          texture, texCoord, u_Resolution, u_WeakThreshold, u_StrongThreshold);
          sum = vec3(edge);  
      } else if (${index} == 20) {
        sum = gabor(texture, texCoord);                
      } else if (${index} == 21) {
        sum = dicRestore(texture, texCoord);          
      } else if (${index} == 22) {
        gl_FragColor.rgb = erode(texture, texCoord, texSize);
        sum = dilate(texture, texCoord, texSize);
      } else if (${index} == 23) {
        gl_FragColor.rgb = dilate(texture, texCoord, texSize);  
        sum = erode(texture, texCoord, texSize);        
      } else if (${index} == 24) {
        sum = erode(texture, texCoord, texSize);
      } else if (${index} == 25) {
        sum = dilate(texture, texCoord, texSize);
      } else if (${index} == 26) { // top_hat filter
        sum = erode(texture, texCoord, texSize);
        sum = (texture2D(texture, texCoord).rgb - sum)*1.1;
      } else if (${index} == 27) { // well filter
        sum = dilate(texture, texCoord, texSize);
        sum = (texture2D(texture, texCoord).rgb - sum)*1.1; 
      } else if (${index} == 28) {
        sum = varianceFun(texture, texCoord, texSize);      
      } else if (${index} == 29) {
        sum = Thinning(texture, texCoord, texSize);           
      } else if (${index} == 30) {
        sum = Pruning(texture, texCoord);
      // } else if (${index} == 33) {
      //   sum = Pruning(texture, texCoord);    
      } else {
        sum = vec3(0.);
        vec2 onePixel = vec2(1) / texSize;
        // for (int num = 1; num<=u_iterNum; num++) {
          for (int i = -${bound}; i <= ${bound}; i++) {
            for (int j = -${bound}; j <= ${bound}; j++) {
              // vec2 onePixel = vec2(1) / texSize(texture, 0);
              vec2 offset = vec2(float(j), float(i));
              sum += texture2D(texture, texCoord + onePixel*offset).rgb * u_deblurKernel[(i+${bound})*(${bound}*2+1) + j+${bound}];
            }
          }
        // }
      }
    }
    gl_FragColor.rgb = sum;
    return sum;
}


uniform vec2 u_Resolution;
uniform float u_WeakThreshold;
uniform float u_StrongThreshold;

/////////////////
vec4 viv_sampleColor(sampler2D texture, vec2 texSize, vec2 texCoord) {
  vec4 color = vec4(0.0);
  if (${bound} <=0 ){
    color = texture2D(texture, texCoord); 
  } else {
    vec3 sum;
    sum = colorChange(texture, texCoord,texSize, u_Resolution, u_iterNum[0]/100., u_iterNum[1]/100.);
    color = vec4(sum, 1.0);
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
  u_iterNum: [7,10],

  canWH: [634., 594.],
  disWH: [791., 744.],

  u_Resolution: [1920 / 3, 1080 / 3],
  u_WeakThreshold: 0.075,
  u_StrongThreshold: 0.082,
};

const generateShaderModule = (bound, index) => ({
  name: 'viv',
  uniforms,
  fs: fs(bound, index),
  passes: [{ sampler: true }],
});

export default generateShaderModule;