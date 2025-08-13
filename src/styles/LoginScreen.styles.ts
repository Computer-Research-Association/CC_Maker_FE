import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    paddingTop: 300,
    backgroundColor: '#fff',
  },
  logo: {
    width: 80,
    height: 80,
    alignSelf: 'center',
    marginBottom: 20,
  },
  welcomeText: {
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  subText: {
    textAlign: 'center',
    fontSize: 14,
    color: '#555',
    marginBottom: 20,
  },
  input: {
    height: 48,
    borderBottomWidth: 1,
    borderColor: '#aaa',
    marginBottom: 16,
    paddingHorizontal: 8,
    fontSize: 16,
  },
  linkRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 40,
  },
  link: {
    color: '#FF9898',
    marginHorizontal: 5,
  },
  separator: {
    color: '#aaa',
  },
  loginButton: {
    backgroundColor: '#FF9898',
    paddingVertical: 14,
    borderRadius: 30,
  },
  loginButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default styles;