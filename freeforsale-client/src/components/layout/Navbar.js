import React, { Component, Fragment } from 'react';
import {Link} from 'react-router-dom';

// Components 
import MyButton from '../../util/MyButton';
import MakePost from '../post/MakePost';
import Notifications from './Notifications';
import ProfileNav from './ProfileNav';

// Material-UI 
import withStyles from '@material-ui/core/styles/withStyles';
import { fade } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Badge from '@material-ui/core/Badge';
import Button from '@material-ui/core/Button';
import InputBase from '@material-ui/core/InputBase';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import Hidden from '@material-ui/core/Hidden';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import CssBaseline from '@material-ui/core/CssBaseline';
import Tooltip from '@material-ui/core/Tooltip';


// Icons
import HomeIcon from '@material-ui/icons/Home';
import MenuIcon from '@material-ui/icons/Menu';
import SearchIcon from '@material-ui/icons/Search';
import ChatIcon from '@material-ui/icons/Chat';
import MarketIcon from '@material-ui/icons/Store';
import SettingsIcon from '@material-ui/icons/Settings';

// Redux
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

const drawerWidth = 240;

const styles = (theme) => ({
    ...theme.spreadThis,
    root: {
        display: 'flex',
        zIndex: 1,
    },
    appBar:{
        zIndex: theme.zIndex.drawer + 1,
        
    },
    drawer:{
        [theme.breakpoints.up('sm')]: {
            width: drawerWidth,
            flexShrink: 0,
          },
    },
    toolbar: theme.mixins.toolbar,
    drawerPaper: {
        width: drawerWidth,
    },
    grow: {
        flexGrow: 1,
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    title: {
        display: 'none',
        [theme.breakpoints.up('sm')]: { 
            display: 'block',
        },
    },
    search: {
        position: 'relative',
        borderRadius: theme.shape.borderRadius,
        backgroundColor: fade("#eeeeee", 0.15),
        '&:hover': {
          backgroundColor: fade("#e0e0e0", 0.25),
        },
        marginRight: theme.spacing(2),
        marginLeft: 0,
        width: '100%',
        [theme.breakpoints.up('sm')]: {
          marginLeft: theme.spacing(25),
          width: 500,
        },
    },
    searchIcon: {
        width: theme.spacing(7),
        height: '100%',
        position: 'absolute',
        pointerEvents: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    inputRoot: {
        color: 'inherit',
    },
    inputInput: {
        padding: theme.spacing(1, 1, 1, 7),
        transition: theme.transitions.create('width'),
        width: '100%',
        [theme.breakpoints.up('md')]: {
          width: 480,
        },
    },
    sectionDesktop: {
        display: 'none',
        [theme.breakpoints.up('md')]: {
          display: 'flex',
        },
    },
      sectionMobile: {
        display: 'flex',
        [theme.breakpoints.up('md')]: {
          display: 'none',
        },
    },
    chatIcon:{
        width: 21,
        height: 21,
    },
});


export class Navbar extends Component {

    state = {
        mobileOpen: false
    }

    handleDrawerToggle = () => {
        this.setState({ mobileOpen: !this.state.mobileOpen })
    };

    render() {
        const { classes, authenticated } = this.props;
        const { mobileOpen } = this.state;

        const drawer = (
            <div>
             
            <div className={classes.toolbar} />
              <List>
                {/* {['Home', 'Marketplace', 'Clothes', 'Furniture'].map((text, index) => ( */}
                <ListItem alignItems="flex-start" button key="Home">
                    {/* <ListItemIcon alignItems="flex-start"> <HomeIcon/> </ListItemIcon> */}
                    <ListItemText primary="Home" />
                </ListItem>
                <ListItem button key="Marketplace">
                    {/* <ListItemIcon><MarketIcon/> </ListItemIcon> */}
                    <ListItemText primary="Marketplace" />
                </ListItem>
                <List>
                    {['Clothes', 'Furniture', 'Textbooks', 'Miscellaneous'].map((text, index) => (
                    <ListItem button key={text}>
                        <ListItemText inset={true} secondary={text} />
                    </ListItem>
                    ))}
                </List>    
            </List>
            <Divider />
            <List>
                <ListItem alignItems="flex-start" button key="Settings">
                        {/* <ListItemIcon alignItems="flex-start"> <SettingsIcon/> </ListItemIcon> */}
                        <ListItemText primary="Settings" />
                </ListItem>
                <ListItem button key="Log Out">
                    {/* <ListItemIcon><LogOutIcon/> </ListItemIcon> */}
                    <ListItemText primary="Log Out" />
                </ListItem>
            </List>
            </div>
          );

        return (
            <Fragment> 
            <div className={classes.root}>
                <CssBaseline/>
                <AppBar position="absolute" style={{zIndex: 2}} className="classes.appBar" color="#fff"> 
                    <Toolbar className="nav-container">
                    {authenticated ? (
                        <Fragment>
                            <IconButton
                                edge="start"
                                className={classes.menuButton}
                                color="inherit"
                                aria-label="open drawer"
                                onClick={this.handleDrawerToggle}>
                                    <MenuIcon/>
                            </IconButton>
                                        
                            <Typography className={classes.title} variant="h6" noWrap>
                                            Free and For Sale
                            </Typography>

                            <div className={classes.search}>
                                <div className={classes.searchIcon}>
                                    <SearchIcon />
                                </div>

                                <InputBase
                                    placeholder="Search…"
                                    classes={{
                                        root: classes.inputRoot,
                                        input: classes.inputInput,
                                    }}
                                    inputProps={{ 'aria-label': 'search' }}/>
                            </div>
                            <div className={classes.grow} />
                            <div className={classes.sectionDesktop}>
                                <MakePost/>

                                <Link to="/">
                                    <MyButton tip="Home">
                                        <HomeIcon/>
                                    </MyButton>
                                </Link>

                                <Tooltip
                                    placement="top"
                                    title="Messages">

                                    <IconButton color="inherit">
                                        <Badge badgeContent={4} color="secondary">
                                            <ChatIcon className={classes.chatIcon}/>
                                        </Badge>
                                    </IconButton>
                                </Tooltip>
                                        
                                <Notifications/>
                                <ProfileNav />
                            </div>
                        </Fragment>
                    ) : (
                        <Fragment>
                            <Button color="inherit" component={Link} to="/">Home</Button>
                            <Button color="inherit" component={Link} to="/login">Login</Button>
                            <Button color="inherit" component={Link} to="/signup">Signup</Button>
                        </Fragment>
                    )}
                
                </Toolbar>
            </AppBar>
            <nav className={classes.drawer}>
            <Hidden smUp implementation="css">
                <Drawer
                    variant="temporary"
                    open={Boolean(mobileOpen)}
                    style={{position: 'relative', zIndex: 1}}

                    onClose={this.handleDrawerToggle}
                    classes={{
                        paper: classes.drawerPaper,
                    }}
                    ModalProps={{
                        keepMounted: true, 
                    }}
                >
                    {drawer}
                </Drawer>
            </Hidden>
            <Hidden lgDown implementation="css">
                <Drawer
                    classes={{
                        paper: classes.drawerPaper,
                    }}
                    variant="permanent"
                    open
                >
                    {drawer}
                </Drawer>
            </Hidden>
            </nav>
            </div>
            </Fragment>
            
            
        );
    }
}

Navbar.propTypes = {
    authenticated: PropTypes.bool.isRequired
};

const mapStateToProps = (state) => ({
    authenticated: state.user.authenticated
});



export default connect(mapStateToProps)(withStyles(styles)(Navbar));
