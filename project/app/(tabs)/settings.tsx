import { View, Text, TouchableOpacity, StyleSheet, Switch } from 'react-native';
import { Globe2, Moon } from 'lucide-react-native';
import { useState } from 'react';

const LANGUAGES = ['English', 'Spanish', 'French', 'German', 'Chinese'];

export default function SettingsScreen() {
  const [darkMode, setDarkMode] = useState(true);
  const [selectedLanguage, setSelectedLanguage] = useState('English');

  return (
    <View style={styles.container}>
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Globe2 size={24} color="#60a5fa" />
          <Text style={styles.sectionTitle}>Language</Text>
        </View>
        <View style={styles.languageContainer}>
          {LANGUAGES.map((lang) => (
            <TouchableOpacity
              key={lang}
              style={[
                styles.languageButton,
                selectedLanguage === lang && styles.selectedLanguage,
              ]}
              onPress={() => setSelectedLanguage(lang)}>
              <Text
                style={[
                  styles.languageText,
                  selectedLanguage === lang && styles.selectedLanguageText,
                ]}>
                {lang}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Moon size={24} color="#60a5fa" />
          <Text style={styles.sectionTitle}>Appearance</Text>
        </View>
        <View style={styles.settingRow}>
          <Text style={styles.settingText}>Dark Mode</Text>
          <Switch
            value={darkMode}
            onValueChange={setDarkMode}
            trackColor={{ false: '#3f3f46', true: '#3b82f6' }}
            thumbColor={darkMode ? '#60a5fa' : '#71717a'}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1b1e',
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#fff',
  },
  languageContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  languageButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#2c2d31',
  },
  selectedLanguage: {
    backgroundColor: '#3b82f6',
  },
  languageText: {
    color: '#fff',
    fontSize: 16,
  },
  selectedLanguageText: {
    fontWeight: '600',
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#2c2d31',
    padding: 16,
    borderRadius: 12,
  },
  settingText: {
    color: '#fff',
    fontSize: 16,
  },
});