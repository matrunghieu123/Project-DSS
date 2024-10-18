import {
  ActivityIndicator,
  Alert,
  FlatList,
  Linking,
  PermissionsAndroid,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, {useEffect, useMemo, useState} from 'react';
import Contacts from 'react-native-contacts';
import {Styles} from '../../../../core/constants/Styles';
import ItemComponent from '../components/ItemComponent';
import {Fonts} from '../../../../core/constants/Fonts';
import {AppColors} from '../../../../core/constants/AppColors';
import {SpaceComponent} from '../../../components';

interface DeviceTabProps {
  navigation: any;
  setLength: (length: number) => void;
}

interface Section {
  letter: string;
  items: Contact[];
}

interface Contact {
  givenName: string;
  familyName: string;
  phoneNumbers: {number: string}[];
  thumbnailPath: string;
}

const DeviceTab = (props: DeviceTabProps) => {
  const [contacts, setContacts] = useState<any[] | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchContacts = () => {
    if (Platform.OS === 'android') {
      PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_CONTACTS, {
        title: 'Contacts',
        message: 'OMICall app would like to access your contacts.',
        buttonPositive: 'Accept',
      }).then(value => {
        if (value === 'granted') {
          Contacts.getAll()
            .then(contacts => {
              setContacts(contacts);
              props.setLength(contacts.length);
            })
            .catch(error => {
              console.log(error);
            });
        }
      });
    } else {
      Contacts.getAll()
        .then(contacts => {
          setContacts(contacts);
          props.setLength(contacts.length);
        })
        .catch(error => {
          if (error.message === "denied"){
                Alert.alert(
                  'Thông báo',
                  'Vui lòng cấp quyền truy cập danh bạ để sử dụng tính năng này',
                  [
                    {
                      text: 'Hủy',
                      onPress: () => {},
                      style: 'cancel',
                    },
                    {
                      text: 'Cài đặt',
                      onPress: () => {
                        Linking.openSettings().then(
                          () => {},
                          err => console.error('An error occurred', err),
                        );
                      },
                    },
                  ],
                );
          }
        });
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchContacts();
    setRefreshing(false);
  };

  const sections = useMemo(() => {
    if (!contacts) {
      return null;
    }

    const sectionsMap = contacts.reduce<Record<string, any[]>>(
      (acc, contact) => {
        const {familyName, givenName} = contact;
        const [firstLetter] = familyName ? familyName : givenName;

        return Object.assign(acc, {
          [firstLetter]: [...(acc[firstLetter] || []), contact],
        });
      },
      {},
    );

    return Object.entries(sectionsMap)
      .map(([letter, items]) => ({
        letter,
        items: items.sort((a, b) => a.familyName.localeCompare(b.familyName)),
      }))
      .sort((a, b) => a.letter.localeCompare(b.letter));
  }, [contacts]);

  if (!sections) {
    return (
      <SafeAreaView style={Styles.center}>
        <ActivityIndicator size="large" />
      </SafeAreaView>
    );
  }

  const renderItem = ({item: {letter, items}}: {item: Section}) => (
    <View key={letter}>
      <Text style={styles.sectionTitle}>{letter}</Text>
      {items.map(
        (
          {givenName, familyName, phoneNumbers, thumbnailPath}: Contact,
          index: number,
        ) => {
          const name = familyName
            ? `${familyName} ${givenName}`
            : `${givenName}`;
          const phone = phoneNumbers.length ? phoneNumbers[0].number : '';
          return (
            <ItemComponent
              name={name}
              phoneNumber={phone}
              onPress={() => {}}
              image={thumbnailPath}
              key={index}
            />
          );
        },
      )}
    </View>
  );

  return (
    <SafeAreaView style={Styles.flex}>
      <FlatList
        data={sections}
        renderItem={renderItem}
        keyExtractor={item => item.letter}
        contentContainerStyle={{padding: '2.5%'}}
        ListFooterComponent={<SpaceComponent height={80} />}
        refreshing={refreshing}
        onRefresh={onRefresh}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  sectionTitle: {
    fontSize: 20,
    fontFamily: Fonts.bold,
    color: AppColors.secondary,
  },
});
export default DeviceTab;
