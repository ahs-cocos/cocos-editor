import React, {useRef} from 'react'
import PropTypes from 'prop-types'
import CKEditor from '@ckeditor/ckeditor5-react'

//this is a custom build with autosave added. It is a linked package!
import DecoupledEditor from '@ckeditor/ckeditor5-build-decoupled-document'

import {ApplicationPath} from "cocos-lib"
import {Sticky} from "semantic-ui-react";
import {ComponentIdentifier} from "./ComponentIdentifier";

//https://ckeditor.com/docs/ckeditor5/latest/builds/guides/integration/frameworks/react.html
//azure ftp pw: AmBa32JBxufvvTnw4hLujjo9iYxdDAobmvQBlZjuaxqWoXiRD2FTkTnhLbmT
//azure db pw: qnWZ4K5uUQmh

const RTEditor = ({readOnly, onChange, onBlur, data, onAutoSave}) => {

    const toolbarRef = useRef(null)

    return (
        <div style={{padding: '5px'}}>
            <ComponentIdentifier displayName='RTEditor'/>

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
                    },
                    autosave: {
                        waitingTime: 5000, // in ms
                        save( editor ) {
                            return onAutoSave( editor.getData() );
                        }
                    },
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
                    onBlur && onBlur(editor.getData())
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
    onBlur: PropTypes.func,
    data: PropTypes.string,
    onAutoSave: PropTypes.func
}

RTEditor.defaultProps = {
    readOnly: false,
    data: ''
}
