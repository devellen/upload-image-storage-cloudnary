import React, { useState } from 'react';
import { View, Button, Image, ActivityIndicator, Alert, FlatList, Text } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';

const CloudinaryUpload = () => {
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadedImages, setUploadedImages] = useState([]); // Lista de imagens carregadas

  const CLOUD_NAME = "dacqhksp2";
  const CLOUDINARY_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload/`;
  // Função para selecionar uma imagem
  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      alert("Permission to access gallery is required!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage({ uri: result.assets[0].uri });
    }
  };
  // Função para fazer o upload da imagem
  const uploadImage = async () => {
    if (!image) {
      Alert.alert("Please select an image first");
      return;
    }

    setUploading(true);

    const data = new FormData();
    data.append('file', {
      uri: image.uri,
      type: 'image/jpeg',
      name: 'upload.jpg',
    });
    data.append('upload_preset', 'atividade4');
    data.append('folder', 'atividade4');

    try {
      const response = await axios.post(CLOUDINARY_URL, data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setUploadedImages([...uploadedImages, response.data.secure_url]);
      Alert.alert("Upload Successful!");
    } catch (error) {
      Alert.alert("Upload Failed", error.message);
    } finally {
      setUploading(false);
    }
  };

  // Remove a imagem
  const deleteImage = (uri) => { 
    const newImages = uploadedImages.filter(item => item !== uri);
    setUploadedImages(newImages);
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20, backgroundColor: 'white' }}>
      {image && <Image source={{ uri: image.uri }} style={{ width: 200, height: 200, marginBottom: 20 }} />}
      <Button title="Pick an Image" onPress={pickImage} buttonStyle={{color: 'black'}} />
      <Button title="Upload Image" onPress={uploadImage} disabled={uploading} />
      {uploading && <ActivityIndicator size="large" color="#0000ff" style={{ marginTop: 20 }} />}
      {uploadedImages.length > 0 && (
        <View style={{ marginTop: 20, width: '100%' }}>
          <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Uploaded Images:</Text>
          <FlatList
            data={uploadedImages}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <View style={{ marginTop: 10, alignItems: 'center', display: 'flex', flexDirection: 'row', justifyContent: 'space-around'}}>
                <Image source={{ uri: item }} style={{ width: 100, height: 100, marginBottom: 10 }} />
                <Button title="excluir" onPress={() => deleteImage(item)} />
              </View>
            )}
          />
        </View>
      )}
    </View>
  );
};

export default CloudinaryUpload;