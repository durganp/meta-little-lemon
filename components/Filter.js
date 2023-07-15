import { ScrollView } from 'react-native';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';

const Filters = ({ onChange, selections, sections }) => {
  return (
    <ScrollView horizontal={true} style={styles.filtersContainer}>
      {sections.map((section, index) => (
        <TouchableOpacity
          key={index}
          onPress={() => {
            onChange(index);
          }}
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            padding: 10,
            marginHorizontal: 10,
            backgroundColor: selections[index] ? '#566652' : '#e5ebe4',
            borderWidth: 1,
            borderRadius: 14,

            borderColor: 'white',
          }}>
          <Text
            style={{
              color: selections[index] ? 'white' : '#566652',
              fontSize: 17,
              fontWeight: '600',
            }}>
            {section}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  filtersContainer: {
    marginBottom: 30,
  },
});

export default Filters;
