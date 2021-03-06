import axios from "axios";
const url = process.env.REACT_APP_BACKENDURL
    ? process.env.REACT_APP_BACKENDURL
    : "http://localhost:8000/";

// =============================================================================
// S T R E A M

export const INCREMENT_STREAM_COUNTER = "INCREMENT_STREAM_COUNTER";

export const incrementCounter = () => (dispatch) => {
    dispatch({ type: INCREMENT_STREAM_COUNTER });
};
// =============================================================================
// Check if all emails are gotten ______________________________________________

export const EMAILS_UPDATE_START = "EMAILS_UPDATE_START";
export const EMAILS_UPDATE_SUCCESS = "EMAILS_UPDATE_SUCCESS";
export const EMAILS_UPDATE_FAILURE = "EMAILS_UPDATE_FAILURE";

export const updateEmails = (emailAddress, token) => (dispatch) => {
    // Retrieves user emails
    dispatch({ type: EMAILS_UPDATE_START });
    const imapAccessHash = btoa(`user=${emailAddress}auth=Bearer ${token}`); // Between the following arrows >< is either a square or a space. IDK what it is but you need it
    sessionStorage.setItem("auth_token", imapAccessHash)
    return axios
        .post(`${url}emails`, {
            email: emailAddress,
            host: "imap.gmail.com", // << will need to be made dynamic upon integration of other email clients
            token: imapAccessHash,
            id_token: sessionStorage.getItem("id_token")
        })
        .then((Response) => {
            return axios
                .post(`${url}emails/stream`, {
                    email: emailAddress,
                    id_token: sessionStorage.getItem("id_token")
                })
                .then((res) => {
                    // console.log("res from /stream", res);
                    const allEmail = res.data.map((email) => {
                        const labelArray = email.labels.split(",");
                        const toArray = email.to ? email.to.toLowerCase().split(",") : null;
                        return {
                            ...email,
                            labels: labelArray,
                            to: toArray
                        };
                    });
                    dispatch({ type: EMAILS_UPDATE_SUCCESS, payload: allEmail });
                    return allEmail;
                });
        })
        .catch((err) => {
            dispatch({ type: EMAILS_UPDATE_FAILURE, payload: err });
            return err;
        });
};
// =============================================================================
// C H A N G E   I S   D I S P L A Y I N G   T H R E A D

export const CHANGE_IS_DISPLAYING_THREAD = "CHANGE_IS_DISPLAYING_THREAD";

export const changeIsDisplayingThread = (bool) => (dispatch) => {
    // Set a switch that displays (true) or hides (false) the thread between the user and another email-address
    dispatch({ type: CHANGE_IS_DISPLAYING_THREAD, payload: bool });
};

// =============================================================================
// C H A N G E   I S   D I S P L A Y I N G   A N A L Y T I C S   B A R
export const CHANGE_IS_DISPLAYING_ANALYTICS = "CHANGE_IS_DISPLAYING_ANALYTICS";

export const changeIsDisplayingAnalytics = (bool) => (dispatch) => {
    // Set a switch that displays (true) or hides (false) the analytics bar
    dispatch({ type: CHANGE_IS_DISPLAYING_ANALYTICS, payload: bool });
};

// =============================================================================
// C H A N G E   T H R E A D   C O N T A C T
export const CHANGE_THREAD_CONTACT = "CHANGE_THREAD_CONTACT";

export const changeThreadContact = (contact) => (dispatch) => {
    // Set the contact whose conversation is displayed in Thread.js
    dispatch({ type: CHANGE_THREAD_CONTACT, payload: contact });
};

// =============================================================================
// C H A N G E   A N A L Y T I C S   C O N T A C T
export const CHANGE_ANALYTICS_CONTACT = "CHANGE_ANALYTICS_CONTACT";

export const changeAnalyticsContact = (contact) => (dispatch) => {
    // Set the contact whose analytics are being displayed
    dispatch({ type: CHANGE_ANALYTICS_CONTACT, payload: { contact } });
};

// =============================================================================

// C H A N G E  I S  I F R A M E L O A D E D

export const IFRAME_LOADED = "IFRAME_LOADED";
export const changeIsLoaded = (bool) => (dispatch) => {
    dispatch({ type: IFRAME_LOADED, payload: bool });
};

// =============================================================================
// C H A N G E  S N I P P E T  F I L T E R
export const SET_SNIPPET_FILTER = "SENT_SNIPPET_FILTER";
export const setSnippetFilter = (string) => (dispatch) => {
    dispatch({ type: SET_SNIPPET_FILTER, payload: string });
};
