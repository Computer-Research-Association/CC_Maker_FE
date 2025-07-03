import { StyleSheet } from 'react-native';


const styles = StyleSheet.create({
  container: { padding: 50, flex: 1, backgroundColor: '#fff',justifyContent: 'center', },
  title: { fontSize: 24, marginBottom: 20, textAlign: 'center' },
  label: {
    marginBottom: 6,
    fontWeight: '600',
  },
  input: {
    height: 48,
    borderBottomWidth: 1,
    borderColor: '#aaa',
    marginBottom: 16,
    paddingHorizontal: 8,
    fontSize: 16,
  },
  radioGroup: {
    flexDirection: 'column',
    justifyContent: 'space-around',
    
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  genderBox: {
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: 10,
    padding: 1,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  roundButton: {
    backgroundColor: '#FF9898',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 30,
    alignItems: 'center',
    marginBottom: 10,
  },
  roundButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    
  },
  emailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    zIndex: 1000,
  },
  emailInput: {
  height: 50,
  borderWidth: 1,
  borderColor: '#ccc',
  paddingHorizontal: 10, // 좌우 패딩만 줌, 위아래 패딩은 0으로
  paddingVertical: 0,
  borderTopLeftRadius: 15,
  borderBottomLeftRadius: 15,
  borderRightWidth: 0,
  backgroundColor: 'rgba(255, 255, 255, 0.7)',
  },
  dropdownWrapper: {
  flex: 5,
  height: 50,
  zIndex: 1000,
  },
  dropdown: {
  height: 50,
  borderWidth: 1,
  borderColor: '#ccc',
  paddingHorizontal: 10,  // emailInput과 맞춤
  paddingVertical: 0,
  borderTopRightRadius: 15,
  borderBottomRightRadius: 15,
  borderTopLeftRadius: 0,
  borderBottomLeftRadius: 0,
  borderLeftWidth: 0,
  backgroundColor: 'rgba(255, 255, 255, 0.7)',
},
  dropdownContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    zIndex: 1000,
  },
});

export default styles;