import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  initContainer: {
    zIndex: 100,
    left: 0,
    right: 0,
    borderWidth: 1,
    borderColor: 'red',
    height: 100,
    position: 'absolute',
    top: 0,
  },
  container: {
    position: 'relative',
    flex: 1,
    flexDirection: 'row',
    borderRadius: 5,
    backgroundColor: 'gray',
    marginRight: 20,
    shadowColor: '#fff',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    zIndex: 100,
  },
  titleContainer: {
    display: 'flex',
    width: '85%',
  },
  childContainer: {
    width: '100%',
    display: 'flex',
  },
  exitIcon: {
    position: 'absolute',
    top: 20,
    right: 20,
  },
});
