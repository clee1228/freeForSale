import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import MyButton from '../../util/MyButton';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import PhotoIcon from '@material-ui/icons/AddPhotoAlternate';
import List from '@material-ui/core/List'



class PhotoUpload extends Component {
    state = {
        selectedPics: [],
        uploadedPics: [],
        finished: false,
       
    }

    // handleChange = (event) => {
    //     const selectedPics = [...event.target.files]
    //     selectedPics.forEach((file) => {
    //         firebase
    //             .storage()
    //             .ref()
    //             .child(`postImages/${file.name}`)
    //             .put(file).then((snapshot) => {
    //                 snapshot.ref.getDownloadURL().then((url) => {
    //                     this.state.uploadedPics.push(url)
    //                 })
    //             })
    //     });     
    // }

    // handleUpload = () => {
    //     const fileInput = document.getElementById('customFile');
    //     fileInput.click();
    // };


    render(){
        // console.log('uploadedPics = ', this.state.uploadedPics)
        let preview = this.state.uploadedPics.map((url, index) => {
            return <img key={index} style={{width:100, height:100}} src={url}/> 
        })
        return(
            <Fragment>
                {/* <form>
                <div className="custom-file mb-4">
                    <input 
                        type="file" 
                        multiple
                        className="custom-file-input" 
                        id="customFile"  
                        hidden="hidden"
                        onChange={this.handleChange}/>

                    <MyButton 
                            tip="Upload photos" 
                            onClick={this.handleUpload}
                            btnClassName="button">
                                <PhotoIcon /> 
                    </MyButton>   
                </div>
                </form>  */}

              

           
                           

                

               
                   
        
         
               
            </Fragment>
        )
    }
};

PhotoUpload.propTypes = {
    uploadedPics: PropTypes.array.isRequired
}

export default PhotoUpload;
