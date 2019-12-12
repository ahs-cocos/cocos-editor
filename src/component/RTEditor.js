import React, {useRef} from 'react'
import PropTypes from 'prop-types'
import CKEditor from '@ckeditor/ckeditor5-react'
import DecoupledEditor from '@ckeditor/ckeditor5-build-decoupled-document'
import {ApplicationPath} from "cocos-lib"
import {Sticky} from "semantic-ui-react";

//https://ckeditor.com/docs/ckeditor5/latest/builds/guides/integration/frameworks/react.html
//azure ftp pw: AmBa32JBxufvvTnw4hLujjo9iYxdDAobmvQBlZjuaxqWoXiRD2FTkTnhLbmT
//azure db pw: qnWZ4K5uUQmh

const RTEditor = ({readOnly, onChange, data}) => {

    const toolbarRef = useRef(null)

    return (
        <div style={{padding: '20px'}}>

            <Sticky offset={50}>
                <div ref={toolbarRef}/>
            </Sticky>
            <CKEditor
                editor={DecoupledEditor}
                disabled={readOnly}
                data={data}
                config={{
                    ckfinder: {
                        // Upload the images to the server using the CKFinder QuickUpload command.
                        uploadUrl: `${ApplicationPath.ck_php_connector}?command=QuickUpload&type=Images&responseType=json`
                    }
                }}
                onInit={editor => {
                    // You can store the "editor" and use when it is needed.
                    if (!readOnly){
                        toolbarRef.current.append(
                            editor.ui.view.toolbar.element
                        );
                    }
                }}
                onChange={(event, editor) => {
                    onChange && onChange(editor.getData())
                }}
                onBlur={(event, editor) => {
                    console.log('Blur.', editor);
                }}
                onFocus={(event, editor) => {
                    console.log('Focus.', editor);
                }}
            />
        </div>
    )
}

export default RTEditor

RTEditor.propTypes = {
    readOnly: PropTypes.bool,
    onChange: PropTypes.func,
    data: PropTypes.string
}

RTEditor.defaultProps = {
    readOnly: false,
    data: ''
}