import * as React from 'react'
import { Text, TextInput, TouchableOpacity, View, StyleSheet, Alert } from 'react-native'
import { useRouter, Stack } from 'expo-router'
import Color from '../../constant/Color'

export default function SignUpScreen() {
  const router = useRouter()

  const [name, setName] = React.useState('')
  const [email, setEmailAddress] = React.useState('')
  const [rollno, setrollno] = React.useState('')
  const [batch, setBatch] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [confirmPassword, setConfirmPassword] = React.useState('')

  const validateEmailDomain = (email) => {
    const validDomain = "@iiitdwd.ac.in";
    return email.endsWith(validDomain);
  };

  const onSignUpPress = async () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Please enter your name')
      return
    }

    if (!email.trim()) {
      Alert.alert('Error', 'Please enter your email')
      return
    }

     if (!validateEmailDomain(email)) {
          Alert.alert("Invalid Email", "Please use your @iiitdwd.ac.in email.");
          return;
        }

    if (!password.trim()) {
      Alert.alert('Error', 'Please enter a password')
      return
    }

    if (password !== confirmPassword) {
      Alert.alert('Password Error', 'Passwords do not match')
      return
    }

    const SignUpData = {name,rollno,email,password,batch}

    try {
      const response = await axios.post('http://localhost:5000/user/signup', SignUpData);
      Alert.alert(response.data.msg)
      router.push('/auth/otp')
    } catch (error) {
      Alert.alert("Signup Failed", error.response?.data?.msg || "Something went wrong");
    }
  }

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: false,
          animation: "slide_from_right",
        }}
      />
      <View style={styles.container}>
        <Text style={styles.textHeader}>Sign Up</Text>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.textInput}
            value={name}
            placeholder="Enter name"
            placeholderTextColor={Color.GRAY}
            onChangeText={setName}
            autoCapitalize="words"
          />
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.textInput}
            autoCapitalize="none"
            value={email}
            placeholder="Enter email"
            placeholderTextColor={Color.GRAY}
            onChangeText={setEmailAddress}
            keyboardType="email-address"
          />
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.textInput}
            autoCapitalize="none"
            value={rollno}
            placeholder="Enter Roll number"
            placeholderTextColor={Color.GRAY}
            onChangeText={setrollno}
          />
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.textInput}
            autoCapitalize="none"
            value={batch}
            placeholder="Enter Batch (CSE/ECE/DSAI)"
            placeholderTextColor={Color.GRAY}
            onChangeText={setBatch}
          />
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.textInput}
            value={password}
            placeholder="Enter password"
            placeholderTextColor={Color.GRAY}
            secureTextEntry={true}
            onChangeText={setPassword}
          />
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.textInput}
            value={confirmPassword}
            placeholder="Confirm password"
            placeholderTextColor={Color.GRAY}
            secureTextEntry={true}
            onChangeText={setConfirmPassword}
          />
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={onSignUpPress}>
            <Text style={styles.buttonText}>Continue</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={() => router.push("/auth/sign-in")}>
            <Text style={styles.buttonText}>Sign In</Text>
          </TouchableOpacity>
        </View>
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
  },
  textHeader: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: Color.PRIMARY,
  },
  inputContainer: {
    marginBottom: 15,
  },
  textInput: {
    padding: 12,
    borderWidth: 1,
    borderRadius: 25,
    backgroundColor: '#e6f2ff',
    borderColor: '#cce0ff',
    fontSize: 16,
    color: '#000',
  },
  buttonContainer: {
    alignItems: 'center',
  },
  button: {
    backgroundColor: Color.PRIMARY,
    paddingVertical: 15,
    borderRadius: 25,
    marginTop: 20,
    alignItems: 'center',
    width: '70%',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
})