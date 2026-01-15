import { useAuth } from '@/src/providers';
import { useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import { isValidEmail, isValidPassword } from '../../../utils';
import { InputField } from './InputField';
import { SignButton } from './SignButton';
import { Title } from './Title';

interface SignInProps {
  parentToggle: () => void;
}

const SignIn = ({ parentToggle }: SignInProps) => {
  const { login } = useAuth();
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setLoading(true);

    try {
      await login({ email, password });
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Authentication failed. Please try again.';
      Alert.alert('Error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    parentToggle();
    setPassword('');
  };

  return (
    <View style={styles.formContainer}>
      <Title isSignUp={false} />

      <InputField
        label="Email"
        textInputProps={{
          value: email,
          onChangeText: setEmail,
          placeholder: 'Enter your email',
          autoCapitalize: 'none',
          keyboardType: 'email-address',
          autoComplete: 'email',
        }}
        warning={{
          showWarning: false,
          warningMessage: 'Please enter valid email',
        }}
      />

      <InputField
        label="Password"
        textInputProps={{
          value: password,
          onChangeText: setPassword,
          placeholder: 'Enter your password',
          secureTextEntry: true,
          autoComplete: 'password',
        }}
        warning={{
          showWarning: false,
        }}
      />

      <SignButton
        isSignUp={false}
        disable={!isValidPassword(password) || !isValidEmail(email) || !email}
        loading={loading}
        handleSubmit={handleSubmit}
        toggleMode={toggleMode}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  formContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
});

export { SignIn };
