import React, { useEffect, useState } from 'react';
import { Text, SafeAreaView, StyleSheet, Image, Keyboard } from 'react-native';
import { Input, Button, Icon } from 'react-native-elements';
import { connect } from 'react-redux';
import { login } from "./../store/actions"

import validator from 'validator';


// Mise à disposition dans les props des méthodes du dispatch
const mapDispatchToProps = (dispatch) => {
    return {
        onLogin: (user) => {
            return new Promise((resolve, reject) => {
                dispatch(login(user)).then((data) => {
                    resolve(data);
                })
            })
        }
    }
}

const Login = (props) => {


    const { route, navigation } = props;

    const [login, setLogin] = useState({
        email: ""
        , password: ""
        , hidePassword: true
        , keyboardShow: false
        , loading: false
    });
    const [errors, setErrors] = useState({
        email: null
        , password: null
    });


    // Methode qui récupère les données mise à dispo dans les props grace au dispatch
    // - > sera éxécuter au click sur le bouton valider
    const onLogin = () => {
        setLogin({ ...login, loading: true });

        props.onLogin({
            user: {
                email: login.email
                , password: login.password
            }
            //     v - on récupère soit les données user (sans le mdp) soit les messages d'erreurs
        }).then((data) => {
            console.log(data)
        })
    }



    const onChange = (value, type) => {
        //réinitialisation des messages d'erreur
        setErrors({ ...errors, email: null, password: null });

        //gestion des mails
        if (type === "email") {
            setLogin((login) => ({ ...login, email: value }))

            // console.log(login);
            if (!validator.isEmail(value) /* || validator.isEmpty(login.email) */) {
                setErrors((errors) => ({ ...errors, email: "Veuillez saisir un email valide" }))
            }

        }

        //gestion des mots de passe
        if (type === "password") {
            setLogin({ ...login, password: value })
            if (!validator.isLength(value, { min: 6 })) {
                setErrors({ ...errors, password: "Minimun 6 caractères !" })
            }
        }
    }


    // Activation du bouton que si il n'y a pas d'erreur
    const disabledButton = () => {
        let disabled = true
        if (!errors.email && !errors.password && !validator.isEmpty(login.email) && !validator.isEmpty(login.password)) {
            disabled = false
        }
        return disabled
    }



    const toRegister = () => {
        navigation.navigate("Enregistrement")
    }
    const hidePassword = () => {
        setLogin((login) => ({ ...login, hidePassword: !login.hidePassword }))
    }

    // Mise à jours de l'état à l'apparition et disparition du clavier
    const keyboardState = (etat) => {
        if (etat === "show") {
            setLogin((login) => ({ ...login, keyboardShow: true }))
        }
        if (etat === "hide") {
            setLogin((login) => ({ ...login, keyboardShow: false }))
        }
    }

    useEffect(() => {
        Keyboard.addListener('keyboardDidShow', () => keyboardState('show'));
        Keyboard.addListener('keyboardDidHide', () => keyboardState('hide'));



        return () => {
            Keyboard.removeListener('keyboardDidShow', () => keyboardState('show'));
            Keyboard.removeListener('keyboardDidHide', () => keyboardState('hide'));
        }

    }, [])

    return (
        <SafeAreaView style={styles.main_container}>
            {!login.keyboardShow &&
                <Image
                    source={require('../assets/Icon3.png')}
                    style={styles.image}
                />
            }


            <Text style={styles.title}>Connectez vous</Text>

            <Input
                placeholder="Adresse email"
                leftIcon={{ type: 'ionicon', name: 'mail-outline' }}
                textContentType="emailAddress"
                onChangeText={value => onChange(value, "email")}
                spellCheck={false}
                autoCorrect={false}
                keyboardType="email-address"
                errorMessage={errors.email}
            />
            <Input
                placeholder="Mot de passe"
                leftIcon={{ type: 'ionicon', name: 'lock-closed-outline' }}
                secureTextEntry={login.hidePassword}
                textContentType="password"
                rightIcon={
                    <Icon
                        type='ionicon'
                        name={login.hidePassword ? 'eye-outline' : 'eye-off-outline'}
                        onPress={hidePassword}
                    />
                }
                onChangeText={value => onChange(value, "password")}
                errorMessage={errors.password}
            />

            <Button
                title="Connexion"
                onPress={onClick} // on va jouer la méthode onLogin
                disabled={disabledButton()}
                buttonStyle={styles.button}
                loading={login.loading}
            />
            <Button
                title="S'inscrire"
                type="clear"
                onPress={toRegister}
            />


        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    main_container: {
        flex: 1
        , padding: 10
        // , alignItems: "center"
        , justifyContent: "center"
    },
    image: {
        width: 200
        , height: 200
        , alignSelf: "center"
        , position: "absolute"
        , top: 40
    },
    title: {
        alignSelf: "center"
        , fontSize: 20
        , textTransform: "uppercase"
        , marginBottom: 20
    },
    button: {
        marginVertical: 20
        , paddingVertical: 10
    }


})

export default connect(null, mapDispatchToProps)(Login) // connect(mapStateToProps, mapDispatchToProps)



/**
 * NOTE - expériences utilisateurs à rajouter/penser
 *  - rediriger vers la page de connexion une fois l'enregistrement réussi
 *  - si label + placeholder : mettre le format de la saisie attendu dans le placeholder
 *  - props spellCheck={false} => pour un input text
 *  - rajouter un icon une fois que la valeur saisie correspond à une valeur attendu (✔️) => spécifier au user que ce qu'il a saisi est correct
 *  - envoyer une des valeurs saisie dans le navigate vers la page register pour préremplir le formulaire
 *          -> (l'utilisateur a voulu se connecter mais n'as pas de compte, il va donc vers la page d'enregistrement avec le formulaire préremplie)
 */


/**
 * NOTE - fonctionnement redux
 *  - le stateToProps met à dispo les données du state dans les props
 *  - le dispatchToProps mets à dispo les méthodes avec des promesses dans les props
 *  ==> Y a t'il des conditions précises pour utiliser l'un ou l'autre ? cela revient il au même ?
 *
 */