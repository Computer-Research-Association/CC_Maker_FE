import { StyleSheet } from 'react-native';
import { GlobalStyles, FontFamily } from './GlobalStyles';

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
    fontFamily: FontFamily.bold,
    marginBottom: 6,
  },
  subText: {
    textAlign: 'center',
    fontSize: 14,
    fontFamily: FontFamily.regular,
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
    fontFamily: FontFamily.regular,
  },
  linkRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 40,
    fontFamily: "Ongeulip",
  },
  link: {
    color: '#FF9898',
    marginHorizontal: 5,
    fontFamily: "Ongeulip",
  },
  separator: {
    color: '#aaa',
  },
  eyeButton: {
    padding: 16,
  },
  formContainer: {
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    paddingHorizontal: 0,
  },
  passwordContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: '#fff',
    width: '100%',
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  passwordInput: {
    flex: 1,
    padding: 16,
    fontSize: 16,
    fontFamily: FontFamily.regular,
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
    fontFamily: FontFamily.bold,
  },
});

export default styles;