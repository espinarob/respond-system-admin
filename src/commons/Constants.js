const Constants = {
	PAGES : {
		LOGIN_PAGE      : 'LOGIN_PAGE',
		ADMIN_HOME_PAGE : 'ADMIN_HOME_PAGE' 
	},
	DATA_CLICKED                : {
		BYSTANDERS              : 'BYSTANDERS',
		RESPONDERS              : 'RESPONDERS',
		INCIDENTS               : 'INCIDENTS'
	},
	FIRE_BASE_CONFIG            : {
		apiKey                  : "AIzaSyAUFpo4C2jL_ABEAQUJXkHXNwOCc4IMFT8",
	    authDomain              : "resys-respondsystem.firebaseapp.com",
	    databaseURL             : "https://resys-respondsystem.firebaseio.com",
	    projectId               : "resys-respondsystem",
	    storageBucket           : "resys-respondsystem.appspot.com",
	    messagingSenderId       : "208216134504"
	},
	JAVASCRIPT_MAP_KEY          : 'AIzaSyD3SzUi7kww6jLmiUz-T9BJiiqe2pW_Wjc',
	POP_UP_CONTENT              : {
		MODIFY_CENTER           : 'MODIFY_CENTER',
		OPTIONS                 : 'OPTIONS',
		ADD_ORGANIZATION        : 'ADD_ORGANIZATION',
		ADD_CALL_SIGNS          : 'ADD_CALL_SIGNS',
		LOGINS_MADE             : 'LOGINS_MADE'
	},
	CALL_SIGN_STATUS            : {
		TAKEN                   : 'TAKEN',
		NOT_TAKEN               : 'NOT_TAKEN'
	},
	REPORT_STATUS               : {
		UNRESOLVED              : 'UNRESOLVED',
		RESOLVED                : 'RESOLVED',
		WAITING_FOR_AUTHORITY   : 'WAITING_FOR_AUTHORITY'
	},
	ERROR_DISPLAY_TIME : 3000,
	RES_SYS_ADMIN_USERNAME_KEY  : 'RES_SYS_ADMIN_USERNAME_KEY',
	RES_SYS_ADMIN_PASSOWRD_KEY  : 'RES_SYS_ADMIN_PASSOWRD_KEY'
}

export default Constants;