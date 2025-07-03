import { StyleSheet } from 'react-native';


const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 160,
    paddingHorizontal: 24,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 12,
    color: '#111',
  },
  subtitle: {
    textAlign: 'center',
    fontSize: 14,
    color: '#999',
    marginBottom: 40,
  },
  input: {
    backgroundColor: '#f7f8fa',
    borderRadius: 16,
    height: 52,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#333',
  },
  Button: {
    marginTop: 24,
    alignSelf: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 30,
    paddingVertical: 14,
    paddingHorizontal: 40,
  },
  laterButtonText: {
    color: '#111',
    fontSize: 16,
    fontWeight: '500',
  },
    codeText: {
    marginTop: 20,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
   copyButton: {
    marginTop: 20,
    paddingVertical: 14,
    paddingHorizontal: 40,
    backgroundColor: '#FF9898',
    borderRadius: 30,
  },
  copyButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  startButton: {
    backgroundColor: '#FF9898',
    paddingVertical: 14,
    paddingHorizontal: 140,
    borderRadius: 30,
    alignItems: 'center',
    marginTop: 200,
  },
  startButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default styles