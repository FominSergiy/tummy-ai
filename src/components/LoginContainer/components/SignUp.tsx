import { useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import { apiService } from '../../../services/api.service';
import { isValidEmail, isValidPassword } from '../../../utils';
import { InputField } from './InputField';
import { SignButton } from './SignButton';
import { Title } from './Title';

interface SignUpProps {
  parentToggle: () => void;
}

const SignUp = ({ parentToggle }: SignUpProps) => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      await apiService.signup({ email, password });
      Alert.alert('Success', 'Account created successfully! Please log in.');

      // reset form state
      setPassword('');
      setConfirmPassword('');

      // parent handler to flip to login page
      parentToggle();
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
    setConfirmPassword('');
    setPassword('');
  };

  return (
    <View style={styles.formContainer}>
      <Title isSignUp={true} />

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
          showWarning: !isValidEmail(email),
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
          // skip warning display for sign up - password has to be valid at this point
          showWarning: !isValidPassword(password),
          warningMessage:
            'Your password has to have at least 1 Upper-case char, 1 digit, and 1 special case char',
        }}
      />

      <InputField
        label="Confirm Password"
        textInputProps={{
          value: confirmPassword,
          onChangeText: setConfirmPassword,
          placeholder: 'Confirm your password',
          secureTextEntry: true,
          autoComplete: 'password',
        }}
        warning={{
          showWarning: !(password === confirmPassword),
          warningMessage: 'Passwords have to match',
        }}
      />

      <SignButton
        isSignUp={true}
        disable={
          !isValidPassword(password) ||
          !isValidEmail(email) ||
          !(password === confirmPassword) ||
          !email
        }
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

export { SignUp };
