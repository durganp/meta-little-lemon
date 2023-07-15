import {
  Image,
  SafeAreaView,
  TextInput,
  StyleSheet,
  Text,
  View,
  ScrollView,
  Pressable,
  Alert,
} from 'react-native';
import React, { useContext, useState } from 'react';
import { AppContext } from '../AppContext';
import { validateEmail } from '../util/validate';

const Onboarding = () => {
  const [firstName, setFirstName] = useState('');
  const [email, setEmail] = useState('');

  const { onboard } = useContext(AppContext);
  return (
    <SafeAreaView style={styles.container}>
      <Image source={require('../assets/Logo.png')} style={styles.image} />
      <View style={styles.banner} keyboardDismissMode="on-drag">
        <View style={styles.title}>
          <Text style={styles.titleText}>Little Lemon</Text>
          <Text style={styles.subTitleText}>Chicago</Text>
        </View>
        <View style={styles.descAndImage}>
          <Text style={styles.description}>
            We are a family owned Mediterranean restaurant , focus on
            traditional recipes served with modern twists{' '}
          </Text>
          <Image
            style={styles.bannerImage}
            source={require('../assets/Hero_image.png')}
          />
        </View>
      </View>

      <ScrollView style={styles.body} keyboardDismissMode="on-drag">
        <Text style={styles.text}>First Name *</Text>
        <TextInput
          style={styles.input}
          value={firstName}
          onChangeText={setFirstName}
          placeholder="first name"
        />

        <Text style={styles.text}>email *</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          placeholder="email"
        />
        <View style={styles.buttonView}>
          <Pressable
            onPress={() => onboard({ firstName, email })}
            style={styles.button}
            disabled={
              (firstName && email) == ''
                ? true
                : !validateEmail(email)
                ? true
                : false
            }>
            <Text style={styles.text}>Next</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Onboarding;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  banner: {
    backgroundColor: '#384d3c',
    padding: 10,
    margin: 5,
  },
  titleText: {
    fontSize: 35,
    color: '#e8da43',
    fontWeight: '800',
    fontFamily: '',
  },
  subTitleText: {
    fontSize: 25,
    color: '#fff',
    fontWeight: '800',
    fontFamily: '',
  },
  descAndImage: {
    flexDirection: 'row',

    justifyContent: 'space-around',
  },

  bannerImage: {
    height: 170,
    width: 130,
    marginBottom: 20,
  },
  description: {
    fontSize: 20,
    color: '#fff',
    paddingRight: 0,
    flex: 1,
  },
  body: {
    paddingHorizontal: 30,
  },
  image: {
    resizeMode: 'contain',

    width: 300,
    height: 60,
    marginTop: 30,
  },
  text: {
    paddingVertical: 10,
    fontSize: 22,
    color: '#384d3c',
    fontWeight: '600',
  },
  input: {
    borderWidth: 1,
    borderColor: '#384d3c',
    borderRadius: 5,
    fontSize: 18,
    padding: 8,
    color: '#384d3c',
  },
  button: {
    borderWidth: 1,

    borderColor: '#384d3c',
    borderRadius: 12,

    paddingHorizontal: 30,
  },
  buttonView: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
});
