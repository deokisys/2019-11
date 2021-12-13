import React from "react";
import apiConfig from "../config/api";
import axios from "axios";

const { apiUrl } = apiConfig;


export const useFetch = (path, handleFetchSuccess, handleFetchError) => {
  React.useEffect(() => {
    let isUnmounted = false;

    const fetchData = async () => {
      try {
        const response = await axios.get(`${apiUrl}${path}`);
        if (!isUnmounted) {
          handleFetchSuccess(response);
        }
      } catch (error) {
        if (!isUnmounted) {
          handleFetchError(error);
        }
      }
    };
    fetchData();

    return () => (isUnmounted = true);
  }, []);
};
