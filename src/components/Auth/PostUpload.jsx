import React, { useState } from 'react';

const PostUpload = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [imageFile, setImageFile] = useState(null);

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle form submission logic here, e.g., submit to API or handle state
        console.log({ title, description, imageFile });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setImageFile(file);
    };

    return (
        <div className="register-container">
            <h2>Upload Form</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="file"
                    onChange={handleFileChange}
                    accept=".jpg, .jpeg, .png"
                    required
                />
                <input
                    type="text"
                    placeholder="Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                />
                <textarea
                    placeholder="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                    style={{
                        marginBottom: '10px',
                        padding: '8px',
                        border: '1px solid #ddd',
                        borderRadius: '4px',
                        width: '100%'
                    }}
                />
                <button type="submit">Upload</button>
            </form>
        </div>
    );
};

export default PostUpload;
