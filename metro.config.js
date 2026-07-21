const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Разрешаем бандлить 3D-модели и текстуры как ассеты
config.resolver.assetExts.push('glb', 'gltf', 'obj', 'mtl', 'hdr');

module.exports = config;
