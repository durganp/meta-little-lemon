import {
  SafeAreaView,
  ScrollView,
  TextInput,
  StyleSheet,
  Text,
  View,
  Image,
  Pressable,
} from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import { Icon } from 'react-native-elements';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaskedTextInput } from 'react-native-mask-text';
import * as ImagePicker from 'expo-image-picker';
import CheckBox from 'expo-checkbox';
import { color } from 'react-native-elements/dist/helpers';
import { AppContext } from '../AppContext';
import { Alert } from 'react-native';

const Profile = ({ navigation }) => {
  const [profile, setProfile] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    image: '',
    orderStatus: false,
    passwordChange: false,
    offer: false,
    newsLetter: false,
  });

  useEffect(() => {
    (async () => {
      try {
        const asyncProfile = await AsyncStorage.getItem('profile');

        setProfile(JSON.parse(asyncProfile));
      } catch (err) {
        Alert.alert(err);
      }
    })();
  }, []);
  const updateData = (key, val) => {
    setProfile((preValue) => ({
      ...preValue,
      [key]: val,
    }));
  };
  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setProfile((preVal) => ({ ...preVal, ['image']: result.assets[0].uri }));
    }
  };
  const removeImage = () => {
    setProfile((preval) => ({ ...preval, ['image']: '' }));
  };

  const { logout } = useContext(AppContext);
  const { update } = useContext(AppContext);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.heading}>
        <Pressable
          style={styles.backIcon}
          onPress={() => navigation.navigate('home')}>
          <Icon name="arrow-left" size={30} color="white" type="entypo" />
        </Pressable>

        <Image
          source={require('../assets/Logo.png')}
          style={styles.headerImage}
        />
        <View style={styles.headingIconAndAvatar}>
          {profile.image ? (
            <Image
              source={{ uri: profile.image }}
              style={{ width: 50, height: 50, borderRadius: 50 }}
            />
          ) : (
            <View style={styles.profilePicPlaceholder}>
              <Text style={styles.placeholderText}>
                {(profile.firstName ? profile.firstName[0] : '') +
                  (profile.lastName ? profile.lastName[0] : '')}
              </Text>
            </View>
          )}
        </View>
      </View>

      <ScrollView style={styles.body}>
        <Text style={styles.informationTitle}>Personal Information</Text>
        <View keyboardDismissMode="on-drag">
          <View style={styles.profile}>
            <View style={styles.profilePic}>
              <Text style={styles.avatar}>avatar</Text>
              {profile.image ? (
                <Image
                  source={{ uri: profile.image }}
                  style={{ width: 50, height: 50, borderRadius: 50 }}
                />
              ) : (
                <View style={styles.imagePlaceholder}>
                  <Text style={styles.placeholderText}>
                    {(profile.firstName ? profile.firstName[0] : '') +
                      (profile.lastName ? profile.lastName[0] : '')}
                  </Text>
                </View>
              )}
            </View>
            <Pressable style={styles.changeAvatar} onPress={pickImage}>
              <Text style={styles.changeAvatarText}>change</Text>
            </Pressable>
            <Pressable
              style={styles.removeAvatar}
              onPress={removeImage}
              disabled={profile.image == '' && true}>
              <Text style={styles.removeAvatarText}>remove</Text>
            </Pressable>
          </View>
          <Text style={styles.text}>First Name</Text>
          <TextInput
            style={styles.input}
            value={profile.firstName}
            onChangeText={(val) => updateData('firstName', val)}
            placeholder="first name"
          />
          <Text style={styles.text}>Last Name</Text>
          <TextInput
            style={styles.input}
            value={profile.lastName}
            onChangeText={(val) => updateData('lastName', val)}
            placeholder="last name"
          />
          <Text style={styles.text}>Email</Text>
          <TextInput
            style={styles.input}
            value={profile.email}
            onChangeText={(val) => updateData('email', val)}
            placeholder="email"
          />
          <Text style={styles.text}>Phone no.</Text>
          <MaskedTextInput
            mask="(999)999-9999"
            style={styles.input}
            value={profile.phone}
            onChangeText={(val) => updateData('phone', val)}
            placeholder="phone no"
            keyboardType="numeric"
          />
          <Text style={styles.informationTitle}>Email Notification</Text>
          <View style={styles.emailNotification}>
            <CheckBox
              value={profile.orderStatus}
              onValueChange={(val) => updateData('orderStatus', val)}
            />
            <Text style={styles.checkBoxText}>Order Status</Text>
          </View>
          <View style={styles.emailNotification}>
            <CheckBox
              value={profile.passwordChange}
              onValueChange={(val) => updateData('passwordChange', val)}
            />
            <Text style={styles.checkBoxText}>Password Change</Text>
          </View>
          <View style={styles.emailNotification}>
            <CheckBox
              value={profile.offer}
              onValueChange={(val) => updateData('offer', val)}
            />
            <Text style={styles.checkBoxText}>Special Offer</Text>
          </View>
          <View style={styles.emailNotification}>
            <CheckBox
              value={profile.newsLetter}
              onValueChange={(val) => updateData('newsLetter', val)}
            />
            <Text style={styles.checkBoxText}>News Letter</Text>
          </View>

          <Pressable style={styles.logoutBtn} onPress={() => logout()}>
            <Text style={styles.logoutText}>Log out</Text>
          </Pressable>
          <View style={styles.changeInformation}>
            <Pressable
              style={styles.discardChange}
              onPress={() => navigation.navigate('home')}>
              <Text style={styles.removeAvatarText}>Discard Change</Text>
            </Pressable>
            <Pressable
              style={styles.saveChange}
              onPress={() => {
                update(profile);
                navigation.navigate('home');
              }}>
              <Text style={styles.changeAvatarText}>save change</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,

    paddingHorizontal: 10,
  },
  heading: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  body: {
    borderColor: '#384d3c',
    borderWidth: 1,

    paddingHorizontal: 20,
  },
  headerImage: {
    resizeMode: 'contain',
    marginTop: 30,
    flex: 1,
    height: 60,
    margin: 10,
  },
  informationTitle: {
    paddingVertical: 10,
    fontSize: 22,
    color: '#384d3c',
    fontWeight: '600',
  },
  text: { paddingTop: 19, paddingBottom: 5, fontSize: 15, color: '#384d3c' },
  profile: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderColor: '#384d3c',
    borderRadius: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#384d3c',
    borderRadius: 5,
    fontSize: 18,
    padding: 5,
    color: '#384d3c',
  },
  logoutBtn: {
    borderWidth: 1,
    borderColor: '#384d3c',
    borderRadius: 5,
    fontSize: 18,
    padding: 5,
    color: '#384d3c',
    backgroundColor: '#e8da43',
  },
  logoutText: {
    textAlign: 'center',
    fontWeight: '600',
  },

  avatar: { fontSize: 12, color: '#384d3c', paddingBottom: 5 },
  changeAvatar: {
    borderWidth: 1,
    marginTop: 15,
    borderColor: '#384d3c',
    borderRadius: 12,
    marginHorizontal: 40,
    backgroundColor: '#384d3c',
  },
  removeAvatar: {
    borderWidth: 1,
    marginTop: 15,
    borderColor: '#384d3c',
    borderRadius: 12,
    marginHorizontal: 40,
    backgroundColor: '#e5ebe4',
  },
  changeAvatarText: { fontSize: 20, color: 'white', padding: 5 },
  removeAvatarText: { fontSize: 20, color: '#384d3c', padding: 5 },
  profilePic: {
    paddin: 10,
    margin: 20,
  },
  headingIconAndAvatar: { paddingTop: 15 },
  backIcon: {
    marginTop: 15,
    borderRadius: 50,
    backgroundColor: '#384d3c',
    padding: 5,
  },
  changeInformation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 20,
    marginHorizontal: 10,
  },
  discardChange: {
    borderWidth: 1,
    borderColor: '#384d3c',
    borderRadius: 12,
    backgroundColor: '#e5ebe4',
  },
  saveChange: {
    borderWidth: 1,
    borderColor: '#384d3c',
    borderRadius: 12,
    backgroundColor: '#384d3c',
  },

  emailNotification: {
    flexDirection: 'row',
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  checkBoxText: {
    paddingHorizontal: 10,
    color: '#384d3c',
  },
  imagePlaceholder: {
    height: 70,
    width: 70,
    borderRadius: 50,
    backgroundColor: '#384d3c',
    justifyContent: 'center',
  },
  profilePicPlaceholder: {
    height: 40,
    width: 40,
    borderRadius: 50,
    backgroundColor: '#384d3c',
    justifyContent: 'center',
  },
  placeholderText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },
});
