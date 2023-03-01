import { useRef, useState, useEffect } from "react";
import { faCheck, faTimes, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from './api/axios';


// TODO apakah kayak gini gak disimpan dalam satu folder lain?
// Nanti kita coba cari tau

const USER_REGEX = /^[A-z][A-z0-9-_]{3,23}$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;

const Register = () => {
    // ini adalah react hook for more detail nanti tak liatin di Notion
    // React bekerja dengan ngerender element tiap kali ada perbedaan
    // Nah biar lo typing tapi gak di render all the time, kita pakai useRef ini
    const userRef = useRef();
    const errRef = useRef();

    

    const [user, setUser] = useState('');
    const [validName, setValidName] = useState(false);
    const [userFocus, setUserFocus] = useState(false);
    
    return (
    <div>Register</div>
    )
}

export default Register
