export default {
    palette: {
        primary: {
          light: '#6573c3',
          main: '#3f51b5',
          dark: '#2c387e',
          contrastText: '#fff'
          },
        secondary: {
          light: '#2a3eb1',
          main: '#3d5afe',
          dark: '#637bfe',
          contrastText: '#fff'
          }
      },
      spreadThis:{
        typography: {
          useNextVariants: true
        },
        form: {
          textAlign: 'center'
        },
        image: {
          //top, right, bottom, left
          margin: '20px auto 20px auto'
        },
        pageTitle: {
          margin: '10px auto 10px auto'
        },
        textField:{
          margin: '10px auto 10px auto'
        },
        button: {
          marginTop: 20,
          //so we can position spinner absolute (in the center)
          position: 'relative'
        },
        customError: {
          color: 'red',
          fontSize: '0.8rem',
          marginTop: 10
        },
        progress:{
          position: 'absolute'
        }
      }
};