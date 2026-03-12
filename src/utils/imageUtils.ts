export const analyzeLighting = (tensor: Float32Array): 'too_dark' | 'too_bright' | 'ok' => {
  let sum = 0;
  // Tensor contains RGB values in [0, 1] range.
  for (let i = 0; i < tensor.length; i++) {
    sum += tensor[i];
  }
  
  const average = sum / tensor.length;
  
  if (average < 0.15) {
    return 'too_dark';
  } else if (average > 0.85) {
    return 'too_bright';
  }
  
  return 'ok';
};
