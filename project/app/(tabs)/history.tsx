import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity } from 'react-native';

const DUMMY_DATA = [
  {
    id: '1',
    image: 'https://images.unsplash.com/photo-1564507592333-c60657eea523',
    title: 'Colosseum',
    date: '2024-02-15',
  },
  {
    id: '2',
    image: 'https://images.unsplash.com/photo-1548013146-72479768bada',
    title: 'Taj Mahal',
    date: '2024-02-14',
  },
];

export default function HistoryScreen() {
  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.card}>
      <Image source={{ uri: item.image }} style={styles.image} />
      <View style={styles.cardContent}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.date}>{item.date}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={DUMMY_DATA}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1b1e',
  },
  list: {
    padding: 16,
    gap: 16,
  },
  card: {
    backgroundColor: '#2c2d31',
    borderRadius: 12,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: 200,
  },
  cardContent: {
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 4,
  },
  date: {
    fontSize: 14,
    color: '#71717a',
  },
});