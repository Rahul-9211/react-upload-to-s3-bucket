import React, { useState } from 'react';
import AWS from 'aws-sdk';
import swal from 'sweetalert';
import Dropzone from "react-dropzone";
import { FaReact } from 'react-icons/fa';


const FileUploader = () => {

    const [videoURL, setvideoURL] = useState([]);
    const [progress, setprogress] = useState(0);

    // function to handle file upload 
    async function handleFileUpload(files) {
        const s3 = new AWS.S3({
            region: 'ap-south-1',
            accessKeyId: process.env.REACT_APP_ACCESS_KEY,
            secretAccessKey: process.env.REACT_APP_SECRET_KEY,
        });
        const uploadPromises = [];

        files.forEach(file => {
            if (file.type === 'video/mp4') {
                const params = {
                    Bucket: 'person8',
                    Key: file.name,
                    Body: file,
                    // ACL: 'public-read',
                };

                const uploadPromise = s3.upload(params, {
                    partSize: 10 * 1024 * 1024, // 10 MB
                    queueSize: 1,
                }).on('httpUploadProgress', function (evt) {
                    const progress = Math.round((evt.loaded / evt.total) * 100);
                    setprogress(progress)
                }).promise();

                uploadPromises.push(uploadPromise);
            }
            else {
                swal("Error!", "Please select only mp4 file!", "danger");
                swal({
                    title: "Error!",
                    text: "Please select only mp4 file!",
                    icon: "warning",
                    button: "Okh!",
                });
            }
        })


        try {
            const results = await Promise.all(uploadPromises);
            // console.log('All files uploaded successfully!', results);
            setvideoURL([...videoURL, ...results])
        } catch (err) {
            console.error(err);
        }


    }



    return (
        <>
            <div className='videoRow'>
                {videoURL.map((data, index) => {
                    return (
                        <div className="customCard" key={index}>
                            <video controls className='videoBox'>
                                <source src={data.Location} type="video/mp4" />
                            </video>
                        </div>)
                })}
                {(() => {
                    if (progress > 0 && progress < 100) {
                        return <div className="customCard">
                            <div className="loader">
                                <strong>{progress}%</strong>
                            </div>
                        </div>
                    }
                })()}
            </div>
            <div className="container">
                <div className="header">
                    <Dropzone
                        accept={'video/mp4'}
                        onDrop={(acceptedFiles) => {
                            handleFileUpload(acceptedFiles);
                        }}
                    >
                        {({ getRootProps, getInputProps }) => (
                            <div className="dropzone">
                                <div
                                    className="dz-message needsclick mt-2"
                                    {...getRootProps()}
                                >
                                    <input {...getInputProps({ multiple: true })} />
                                    <div className="mb-3">
                                        <i className="display-4 text-muted bx bx-cloud-upload" />
                                    </div>
                                    <h4><FaReact className='' size={100} color="rgb(51, 141, 255)" /> <div>Drop files here or click to upload.</div></h4>
                                </div>
                            </div>
                        )}
                    </Dropzone>
                </div>
            </div>
        </>
    );
};

export default FileUploader;
