import {View, Text} from 'react-native';
import React, {useEffect, useState} from 'react';
import modelsAPI from '../../../../services/models_api.ts';
import {Styles} from '../../../../core/constants/Styles.ts';
import ItemComponent from '../components/ItemComponent.tsx';

const ContactTab = () => {
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      try {
        const response = await modelsAPI.getContact();
        console.log(response);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData().catch(error => console.log(error));
  }, []);
  return (
    <View style={Styles.flex}>
      <ItemComponent
        name={'Quang Anh'}
        phoneNumber={'0795206304'}
        onPress={() => {}}
      />
      <ItemComponent
        name={'Quang Anh'}
        phoneNumber={'0795206304'}
        onPress={() => {}}
      />
    </View>
  );
};

export default ContactTab;
