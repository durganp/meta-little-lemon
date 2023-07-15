import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Image } from 'react-native';
import { Alert } from 'react-native';
import debounce from 'lodash.debounce';

import { getSectionListData, useUpdateEffect } from '../util/utils';
import { Searchbar } from 'react-native-paper';
import {
  createTable,
  getMenuItems,
  saveMenuItems,
  filterByQueryAndCategories,
} from '../database';

import Filters from '../components/Filter';
import { SectionList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Pressable, ScrollView } from 'react-native';

const API_URL =
  'https://raw.githubusercontent.com/Meta-Mobile-Developer-PC/Working-With-Data-API/main/capstone.json';
const sections = ['starters', 'mains', 'desserts', 'drinks'];

const Item = ({ name, price, image, description }) => (
  <View style={styles.item}>
    <View style={styles.itemText}>
      <Text style={styles.itemTitle}>{name}</Text>
      <Text style={styles.itemDescription}>{description}</Text>
      <Text style={styles.itemPrice}>${price}</Text>
    </View>
    <View>
      <Image
        source={{
          uri: `https://github.com/Meta-Mobile-Developer-PC/Working-With-Data-API/blob/main/images/${image}?raw=true`,
        }}
        style={styles.menuItemImage}
      />
    </View>
  </View>
);
const Home = ({ navigation }) => {
  const [profile, setProfile] = useState([]);
  const [data, setData] = useState([]);
  const [searchBarText, setSearchBarText] = useState('');
  const [query, setQuery] = useState('');
  const [filterSelections, setFilterSelections] = useState(
    sections.map(() => false)
  );
  const fetchData = async () => {
    try {
      let response = await fetch(API_URL);
      let json = await response.json();
      menu = json.menu.map((item, index) => ({
        id: index + 1,
        name: item.name,
        price: item.price,
        description: item.description,
        image: item.image,
        category: item.category,
      }));
      return menu;
    } catch (err) {
      console.error(err);
    }
  };
  useEffect(() => {
    (async () => {
      try {
        await createTable();

        let menuItems = await getMenuItems();

        if (!menuItems.length) {
          const menuItems = await fetchData();
          saveMenuItems(menuItems);
        }
        const getProfile = await AsyncStorage.getItem('profile');
        setProfile(JSON.parse(getProfile));
        const sectionListData = getSectionListData(menuItems);
        setData(sectionListData);
      } catch (e) {
        Alert.alert(e.message);
      }
    })();
  }, []);
  useUpdateEffect(() => {
    (async () => {
      const activeCategories = sections.filter((s, i) => {
        // If all filters are deselected, all categories are active
        if (filterSelections.every((item) => item === false)) {
          return true;
        }
        return filterSelections[i];
      });
      try {
        const menuItems = await filterByQueryAndCategories(
          query,
          activeCategories
        );
        const sectionListData = getSectionListData(menuItems);
        setData(sectionListData);
      } catch (e) {
        Alert.alert(e.message);
      }
    })();
  }, [filterSelections, query]);

  const lookup = useCallback((q) => {
    setQuery(q);
  }, []);

  const debouncedLookup = useMemo(() => debounce(lookup, 500), [lookup]);

  const handleSearchChange = (text) => {
    setSearchBarText(text);
    debouncedLookup(text);
  };

  const handleFiltersChange = async (index) => {
    const arrayCopy = [...filterSelections];
    arrayCopy[index] = !filterSelections[index];
    setFilterSelections(arrayCopy);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.heading} keyboardDismissMode="on-drag">
        <Image
          source={require('../assets/Logo.png')}
          style={styles.headerImage}
        />
        <Pressable
          style={styles.headingIconAndAvatar}
          onPress={() => navigation.navigate('profile')}>
          {profile.image ? (
            <Image
              source={{ uri: profile.image }}
              style={{ width: 50, height: 50, borderRadius: 50 }}
            />
          ) : (
            <Text style={styles.placeholderText}>
              {(profile.firstName ? profile.firstName[0] : '') +
                (profile.lastName ? profile.lastName[0] : '')}
            </Text>
          )}
        </Pressable>
      </View>

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

        <Searchbar
          round
          onclear={(text) => handleSearchChange('')}
          onChangeText={handleSearchChange}
          value={searchBarText}
          style={styles.search}
          inputStyle={{ color: '#333333' }}
        />
      </View>

      <Text
        style={{
          fontSize: 30,
          fontWeight: '800',
          color: '#384d3c',
          padding: 5,
        }}>
        Order for delivery
      </Text>
      <View>
        <Filters
          selections={filterSelections}
          onChange={handleFiltersChange}
          sections={sections}
        />
      </View>
      <SectionList
        style={styles.sectionList}
        sections={data}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Item
            name={item.name}
            price={item.price}
            image={item.image}
            description={item.description}
          />
        )}
      />
    </SafeAreaView>
  );
};

export default Home;

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
  },
  headerImage: {
    resizeMode: 'contain',
    marginTop: 30,
    flex: 1,
    height: 60,
    margin: 5,
  },
  informationTitle: {
    paddingVertical: 10,
    fontSize: 22,
    color: '#384d3c',
    fontWeight: '600',
  },

  profile: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderColor: '#384d3c',
    borderRadius: 5,
  },
  banner: {
    backgroundColor: '#384d3c',
    padding: 10,
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
  filtersContainer: {},
  headingIconAndAvatar: {
    marginTop: 30,
    height: 40,
    width: 40,
    borderRadius: 50,
    backgroundColor: '#566652',
    justifyContent: 'center',
    textAlign: 'center',
  },
  profilePicPlaceholder: {
    height: 40,
    width: 40,
    borderRadius: 50,
    backgroundColor: '#566652',
    justifyContent: 'center',
  },
  placeholderText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },
  item: {
    flexDirection: 'row',
    margin: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#d1cfcf',
  },
  menuItemImage: { height: 80, width: 70, margin: 10 },
  itemText: { flex: 1 },
  itemTitle: { fontSize: 20, fontWeight: '500', paddingBottom: 5 },
  itemDescription: { color: '#384d3c', fontSize: 15, paddingBottom: 5 },
  itemPrice: {
    color: '#384d3c',
    fontSize: 15,
    fontWeight: '600',
    paddingBottom: 10,
  },
});
