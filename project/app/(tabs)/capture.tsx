import { useState } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { Camera, Image as ImageIcon } from 'lucide-react-native';
import { analyzeImage } from '../../utils/gemini';
import { supabase } from '../../utils/supabase';

export default function CaptureScreen() {
  const [image, setImage] = useState(null);
  const [location, setLocation] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState(null);

  const getLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Location Required',
          'Please enable location services to analyze historical places.',
          [{ text: 'OK' }]
        );
        return null;
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });
      return {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };
    } catch (error) {
      Alert.alert('Error', 'Failed to get location. Please try again.');
      return null;
    }
  };

  const analyzeHistoricalPlace = async (imageUri) => {
    try {
      setAnalyzing(true);
      const locationData = await getLocation();
      if (!locationData) {
        return;
      }

      const analysis = await analyzeImage(imageUri, locationData);
      
      // Extract a title from the analysis (first line or sentence)
      const title = analysis.split(/[.\n]/)[0].slice(0, 100);

      // Save to Supabase
      const { data, error } = await supabase.from('places').insert({
        image_url: imageUri,
        latitude: locationData.latitude,
        longitude: locationData.longitude,
        title: title,
        description: analysis,
      });

      if (error) {
        throw error;
      }

      setAnalysis(analysis);
      setLocation(locationData);
    } catch (error) {
      Alert.alert(
        'Error',
        'Failed to analyze the image. Please try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setAnalyzing(false);
    }
  };

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled) {
        setImage(result.assets[0].uri);
        await analyzeHistoricalPlace(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick image. Please try again.');
    }
  };

  const takePhoto = async () => {
    try {
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled) {
        setImage(result.assets[0].uri);
        await analyzeHistoricalPlace(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to take photo. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      {image ? (
        <View style={styles.imageContainer}>
          <Image source={{ uri: image }} style={styles.image} />
          {analyzing ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#60a5fa" />
              <Text style={styles.loadingText}>Analyzing historical place...</Text>
            </View>
          ) : analysis ? (
            <View style={styles.analysisContainer}>
              <Text style={styles.analysisText}>{analysis}</Text>
              <TouchableOpacity 
                style={styles.retakeButton} 
                onPress={() => {
                  setImage(null);
                  setAnalysis(null);
                }}
              >
                <Text style={styles.buttonText}>Capture Another</Text>
              </TouchableOpacity>
            </View>
          ) : null}
        </View>
      ) : (
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={takePhoto}>
            <Camera size={24} color="#fff" />
            <Text style={styles.buttonText}>Take Photo</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={pickImage}>
            <ImageIcon size={24} color="#fff" />
            <Text style={styles.buttonText}>Pick from Gallery</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1b1e',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonContainer: {
    gap: 20,
  },
  button: {
    backgroundColor: '#2563eb',
    padding: 16,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  imageContainer: {
    width: '100%',
    height: '100%',
  },
  image: {
    width: '100%',
    height: '50%',
    resizeMode: 'contain',
  },
  loadingContainer: {
    padding: 20,
    alignItems: 'center',
  },
  loadingText: {
    color: '#fff',
    marginTop: 10,
    fontSize: 16,
  },
  analysisContainer: {
    padding: 20,
    flex: 1,
  },
  analysisText: {
    color: '#fff',
    fontSize: 16,
    lineHeight: 24,
  },
  retakeButton: {
    backgroundColor: '#2563eb',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
});