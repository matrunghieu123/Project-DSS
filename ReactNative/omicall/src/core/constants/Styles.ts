import {Fonts} from './Fonts.ts';

export const Styles = {
  container: {
    flex: 1,
    paddingHorizontal: 30,
    backgroundColor: 'white',
  },
  center: {
    flex: 1,
    alignItems: 'center' as 'center',
    justifyContent: 'center' as 'center',
  },
  headerContainer: {
    flexDirection: 'row' as 'row',
    alignItems: 'center' as 'center',
  },
  headerText: {
    fontSize: 20,
    fontFamily: Fonts.medium,
    position: 'absolute' as 'absolute',
    left: 0,
    right: 0,
    textAlign: 'center' as 'center',
  },
  boxShadow:{
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3.84,
    elevation: 5,
  },
};
