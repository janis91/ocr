export type OCSingleTranslation = (appName: string, translationString: string, options?: { [param: string]: string }) => string;
export type OCMultiTranslation = (appName: string, singleTranslationString: string, multipleTranslationString: string, count: number, options?: { [param: string]: string }) => string;

export interface OC {
    PERMISSION_UPDATE: number;
    Notification: OCNotification;
    generateUrl: (path: string) => string;
    requestToken: string;
    appswebroots: { [appName: string]: string };
    webroot: string;
}

export interface OCNotification {
    /**
     * Shows a notification as HTML without being sanitized before.
     * If you pass unsanitized user input this may lead to a XSS vulnerability.
     * Consider using show() instead of showHTML()
     * @param {string} html Message to display
     * @param {Object} [options] options
     * @param {string} [options.type] notification type
     * @param {int} [options.timeout=0] timeout value, defaults to 0 (permanent)
     * @return {jQuery} jQuery element for notification row
     */
    showHtml(html: string, options?: { timeout?: number, type?: 'error' }): JQuery<Element>;
}

export interface OCA {
    Files: Files;
}

interface Files {
    App: FilesApp;
    fileActions: FileActions;
}

interface FilesApp {
    fileList: FileList;
}

interface FileList {
    filesClient: FilesClient;
    $fileList: JQuery<HTMLTableElement>;
    $el: JQuery<HTMLDivElement>;

    /**
     * Returns the file info of the selected files
     *
     * @return array of files
     */
    getSelectedFiles: () => Array<OCAFile>;

    /**
     * Reloads the file list using ajax call
     *
     * @return ajax call object
     */
    reload: () => void;

    /**
     * Gets the download url for one or more files in the given directory.
     *
     * @param {String|Array<String>} files the file name(s)
     * @param {String} dir (Optional) directory (default is the current directory)
     * @param {bool} isDir (Optional) if the given file name is a directory (default is false)
     */
    getDownloadUrl: (files: string | Array<string>, dir?: string, isDir?: boolean) => string;

    /**
     * Add file into the list by fetching its information from the server first.
     *
     * If the given directory does not match the current directory, nothing will
     * be fetched.
     *
     * @param {String} fileName file name / path
     * @param {String} [dir] optional directory, defaults to the current one
     * @param {Object} [options] map of attributes
     * @param {boolean} [options.updateSummary] true to update the summary after adding (default), false otherwise. Defaults to true.
     * @param {boolean} [options.silent] true to prevent firing events like "fileActionsReady", defaults to false.
     * @param {boolean} [options.animate] true to animate the thumbnail image after load, defaults to true.
     * @param {boolean} [options.scrollTo] true to scroll to the file after load, defaults to false.
     * @return {Promise} promise that resolves with the file info, or an
     * already resolved Promise if no info was fetched. The promise rejects
     * if the file was not found or an error occurred.
     *
     * @since 9.0
     */
    addAndFetchFileInfo: (fileName: string, dir?: string, options?: { updateSummary?: boolean; silent?: boolean; animate?: boolean; scrollTo?: boolean; }) => JQueryPromise<void>;

    /**
     * Removes a file entry from the list
     * @param name name of the file to remove
     * @param {Object} [options] map of attributes
     * @param {boolean} [options.updateSummary] true to update the summary after removing, false otherwise. Defaults to true.
     * @return deleted element
     */
    remove: (name: string, options?: { updateSummary: boolean; }) => JQuery<HTMLElement>;

    /**
     * Returns the current directory
     * @method getCurrentDirectory
     * @return current directory
     */
    getCurrentDirectory: () => string;

    multiSelectMenuItems: Array<MultiSelectMenuItem>;
}

export interface MultiSelectMenuItem {
    /**
     * The click action handler.
     */
    action: () => void;
    displayName: string;
    iconClass: string;
    name: string;
}

interface FilesClient {
    /**
     * Puts the given data into the given file.
     *
     * @param {String} path path to file (including file name)
     * @param {String} body file body
     * @param {Object} [options]
     * @param {String} [options.contentType='text/plain'] content type
     * @param {bool} [options.overwrite=true] whether to overwrite an existing file
     *
     * @return {Promise}
     */
    putFileContents: (path: string, body: ArrayBuffer, options: { contentType: string, overwrite: boolean }) => JQueryPromise<void>;

    /**
     * Deletes a file or directory
     *
     * @param {String} path path to delete (including file name)
     *
     * @return {Promise}
     */
    remove: (path: string) => JQueryPromise<void>;
}

interface FileActions {
    /**
     * Clears all registered file actions.
     */
    clear: () => void;

    /**
     * Register the actions that are used by default for the files app.
     */
    registerDefaultActions: () => void;

    /**
     * Register action
     *
     * @param action FileAction
     */
    registerAction: (action: FileAction) => void;
}

interface FileAction {
    name: string;
    displayName: string | ((context: any) => string);
    mime: string;
    permissions: number;
    iconClass: string | ((context: any) => string);
    render?: (actionSpec: any, $row: any, isDefault: any) => JQuery<HTMLLinkElement>;
    order: number;
    actionHandler: OCAFileActionHandler;
    altText: string | ((context: any) => string);
}

export type OCAFileActionHandler = (ocaFilesFileName: string, context: { dir: string, fileInfoModel: OCAFileInfoModel, fileActions: FileActions }) => void;

interface OCAFileInfoModel {
    attributes: OCAFile;
}

/**
 * This is the maximal subset defined by the intersection of a selected file and a file given by file action.
 */
export interface OCAFile {
    id: number;
    name: string;
    path: string;
    size: number;
    mimetype: string;
    permissions: number;
    mtime: number;
    etag: string;
}
