import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import MyButton from '../../util/MyButton';
import ImageUploader from 'react-images-upload';

//Firebase
import * as firebase from 'firebase'
import 'firebase/firestore';
import 'firebase/auth';
import 'firebase/storage';


// MUI
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import CircularProgress from '@material-ui/core/CircularProgress';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import withStyles from '@material-ui/core/styles/withStyles';
import SwipeableViews from 'react-swipeable-views';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Paper from '@material-ui/core/Paper';


// Icon
import AddIcon from '@material-ui/icons/Add';
import CloseIcon from '@material-ui/icons/Close';
import PhotoIcon from '@material-ui/icons/AddPhotoAlternate';


// Redux
import { connect } from 'react-redux';
import { createPost, clearErrors } from '../../redux/actions/dataActions';
import { grey } from '@material-ui/core/colors';

const styles = (theme) => ({
    ...theme.spreadThis,
    submitButton:{
        position: 'relative',
        float: 'right',
        marginTop: 10
    },
    progressSpinner: { 
        position: 'absolute'
    },
    closeButton: {
        position: 'absolute',
        left: '91%',
        top: '6%'
    },
    photoIcon:{
        position: 'relative',
        float: 'right',
        marginTop: 10
    },
    uploadPhotoButton:{
        width: 100,
        height: 100, 
        background: grey,
    },
    

});


//TODO: have to upload files first and then return it to here and call CreatePost after w/ links to URLs



class MakePost extends Component{
    state = {
        open: false, //dialog
        body: '',
        postTitle: '',
        name: '',
        errors: {},
        loadedPics: [],
        picUrls: [],
        showUploader: false,
    };

    
    componentWillReceiveProps(nextProps){
        if(nextProps.UI.errors){
            this.setState({
                errors: nextProps.UI.errors
            });
        };
        if(!nextProps.UI.errors && !nextProps.UI.loading){
            this.setState({ body: '', open: false, errors: {} });
        }
    }

    handleOpen = () => {
        this.setState({ open: true })
    };

    handleClose = () => {
        this.props.clearErrors();
        this.setState({ 
            open: false,
            errors: {}
        });
    };

    handleChange = (event) => {
        this.setState( { [event.target.name]: event.target.value})
    };

    handleSubmit = (event) => {
        event.preventDefault();
        let pics = this.state.loadedPics
        let files = []
        let fd = new FormData();
        

        pics.forEach((pic, index) => {
            var file = this.dataURLtoFile(pic.url, pic.name)
            var i = index.toString()
            files.push(file)

            // firebase
            //     .storage()
            //     .ref()
            //     .child(`postImages/${pic.name}`)
            //     .put(file).then((snapshot) => {
            //         snapshot.ref.getDownloadURL().then((url) => {
            //             console.log('type = ', typeof url)
            //             urls.push(url)
            //         })
            //     })
            //     .catch((err) => {
            //         console.log(err)
            //     })
        })

        fd.append('title' , this.state.postTitle)
        fd.append('body', this.state.body)
        
        for (var i=0;i<files.length; i++){
            fd.append("fileToUpload[]", files[i], files[i].name)
        }


        for (var pair of fd.entries()){
            console.log(pair[0], pair[1])
        }

        this.props.createPost(fd)
    };



    handleUpload = (event) => {
        const selectedPics = [...event.target.files]
        selectedPics.forEach((file) => {
            firebase
                .storage()
                .ref()
                .child(`postImages/${file.name}`)
                .put(file).then((snapshot) => {
                    snapshot.ref.getDownloadURL().then((url) => {
                        this.state.uploadedPics.push(url)
                    })
                })
        });     
    }

    openFileBrowser = () => {
        const fileInput = document.getElementById('customFile');
        fileInput.click();
    };

    onDrop = (pictureFiles) => {

        var loaded =[]
        let files = pictureFiles
        
        for (var i=0; i < pictureFiles.length; i++){
            let imgName;
            if (pictureFiles.length > 0){
                imgName =  pictureFiles[i].name
            }
          
            let reader = new FileReader();
            reader.onload = r => {
                loaded.push({url: r.target.result, name: imgName})
            }
            reader.readAsDataURL(files[i])
        }

        
        this.setState({
            loadedPics: loaded
        });
    }

    dataURLtoFile = (dataurl, filename) => {
        var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
            bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
            while(n--){
                u8arr[n] = bstr.charCodeAt(n);
            }
            return new File([u8arr], filename, {type:mime});
        }

    render(){
        const { errors } = this.state;
        const { classes, UI: { loading }} = this.props;
       
        return (
            <Fragment>
                <MyButton 
                    onClick={this.handleOpen}
                    tip="Create a post" >
                        <AddIcon color="primary"/>
                    </MyButton>
                    <Dialog
                        open={this.state.open}
                        onClose={this.handleClose}
                        fullWidth
                        maxWidth="md">

                    <DialogContent>

                    <form onSubmit={this.handleSubmit}>
                        <TextField
                            name="postTitle"
                            // name="title"
                            type="text"
                            multiline
                            variant="outlined"
                            placeholder="What are you selling?"
                            error={errors.body ? true : false}
                            helperText = {errors.body} 
                            className={classes.textField}
                            onChange={this.handleChange}
                            fullWidth
                            />

                        <TextField
                            name="body"
                            type="text"
                            multiline
                            rows="3"
                            variant="outlined"
                            placeholder="Describe your item (Optional)"
                            className={classes.textField}
                            onChange={this.handleChange}
                            fullWidth
                            />


                        <MyButton 
                                tip="Upload photos" 
                                onClick={() => this.setState({showUploader: !this.state.showUploader})}
                                className={classes.photoIcon}
                                btnClassName="button">
                                    <PhotoIcon /> 
                        </MyButton>   
                        {this.state.showUploader ?
                        
                            <ImageUploader
                                className={classes.imageUploader}
                                withIcon={false}
                                // buttonText='Upload images'
                                // fileContainerStyle={{width: '75%'}}
                                buttonStyles={{}}
                                onChange={this.onDrop.bind(this)}
                                imgExtension={['.jpg', '.png']}
                                maxFileSize={5242880}
                                withPreview={true}
                                fileSizeError='File size is too big'
                                withLabel={false}
                            />
                            :null
                        }

                    <Button 
                        type="submit" 
                        variant="contained"
                        color="primary"
                        className={classes.submitButton}
                        disabled={loading}>
                            Post
                            {loading && (
                                    <CircularProgress 
                                    size={20}
                                    className={classes.progressSpinner}/>
                            )}
                        
                    </Button>




                    
                        </form>


                    
                    
                    
                            



                    
                   

                    </DialogContent> 
                    </Dialog>
            </Fragment>
        ) 
    }

}

MakePost.propTypes = {
    createPost: PropTypes.func.isRequired,
    clearErrors: PropTypes.func.isRequired,
    UI: PropTypes.object.isRequired,
    uploadedPics: PropTypes.array
}

const mapStateToProps = (state) => ({
    UI: state.UI
});

export default connect(
    mapStateToProps, 
    { createPost, clearErrors }
    )(withStyles(styles)(MakePost));