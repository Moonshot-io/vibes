import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';

type User = {
  currentUserInfo: {
    id: string;
    fullName: string;
    profileURL?: string;
    email: string;
    fbId?: string;
    instaId?: string;
    twitterId?: string;
  };
  getCurrentUser: () => void;
  logoutUser: () => void;
  userContacts: {
    profileURL: string;
    fullName: string;
  }[];
};

const UserContext = React.createContext<Partial<User>>({});

const UserContextProvider = ({ children }) => {
  const [currentUserInfo, setCurrentUserInfo] = useState<{
    id: string;
    fullName: string;
    profileURL?: string;
    email: string;
    fbId?: string;
    instaId?: string;
    twitterId?: string;
  }>({
    id: '',
    fullName: '',
    profileURL: '',
    email: '',
    fbId: '',
    instaId: '',
    twitterId: '',
  });
  const [userContacts, setUserContacts] = useState([]);

  const logoutUser = () => {
    axios
      .post('/logout')
      .then(() =>
        setCurrentUserInfo({
          id: '',
          fullName: '',
          profileURL: '',
          email: '',
          fbId: '',
          instaId: '',
          twitterId: '',
        })
      )
      .catch((err) => {
        console.error(err);
      });
  };

  const getCurrentUser = () => {
    axios
      .get('/hidden')
      .then(({ data }) => {
        setCurrentUserInfo(data);
      })
      .catch((err) => {
        console.error(err);
      });
  };


  useEffect(() => {
    getCurrentUser();
  }, []);

  useEffect(() => {
    getUserContacts();
  }, [currentUserInfo.id]);

  const getUserContacts = useCallback(() => {
    if (currentUserInfo) {
      axios
        .get('/api/users/allusers', { params: { id: currentUserInfo?.id } })
        .then((resObj) => {
          setUserContacts(resObj.data);
        });
    }
  }, [currentUserInfo.id]);

  const appProps = {
    userContacts,
    logoutUser,
    currentUserInfo,
    getCurrentUser,
    setCurrentUserInfo,
  };

  return (
    <UserContext.Provider value={appProps}>{children}</UserContext.Provider>
  );
};
export { UserContextProvider, UserContext };
