import { INodeType, INodeTypeDescription, NodeConnectionType } from 'n8n-workflow';


export class Cognee implements INodeType {
    description: INodeTypeDescription = {
        // Basic node details will go here
        displayName: 'Cognee',
        name: 'Cognee',
        icon: 'file:cognee.svg',
        group: ['transform'],
        version: 1,
        subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
        description: 'Get data from Cognee APIs',
        defaults: {
            name: 'Cognee',
        },
        inputs: [NodeConnectionType.Main],
        outputs: [NodeConnectionType.Main],
        credentials: [
            {
                name: 'CogneeApi',
                required: true,
            },
        ],
        requestDefaults: {
            baseURL: 'http://localhost:8000',
            headers: { Accept: 'application/json' },
        },

        properties: [
            // Resources and operations will go here
            {
                displayName: 'Resource',
                name: 'resource',
                type: 'options',
                noDataExpression: true,
                options: [
                    { name: 'Login', value: 'login' },
                    { name: 'Add Data', value: 'addData' },
                    { name: 'Cognify', value: 'cognify' },
                ],
                default: 'login',
            },
            // (Operations will go below...)
            {
                displayName: 'Operation',
                name: 'operation',
                type: 'options',
                noDataExpression: true,
                displayOptions: {
                    show: { resource: ['login'] }
                },
                options: [
                    {
                        name: 'Post',
                        value: 'post',
                        action: 'Post the login',
                        description: 'Post the login',
                        routing: {
                            request: {
                                method: 'POST',
                                url: '/api/v1/auth/login',
                                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                            },
                        },
                    },
                ],
                default: 'post',
            },
            // ─── parameters that feed the request body ─────────────────────
            {
                displayName: 'Username',
                name: 'username',
                type: 'string',
                default: 'default_user@example.com',
                required: true,
                displayOptions: { show: { resource: ['login'] } },
                routing: { request: { body: { username: '={{$value}}' } } },
            },
            {
                displayName: 'Password',
                name: 'password',
                type: 'string',
                typeOptions: { password: true },
                default: 'default_password',
                required: true,
                displayOptions: { show: { resource: ['login'] } },
                routing: { request: { body: { password: '={{$value}}' } } },
            },
            {
                displayName: 'Grant Type',
                name: 'grantType',
                type: 'hidden',
                default: 'password',
                displayOptions: { show: { resource: ['login'] } },
                routing: { request: { body: { grant_type: 'password' } } },
            },
            {
                displayName: 'Scope',
                name: 'scope',
                type: 'string',
                default: '',
                displayOptions: { show: { resource: ['login'] } },
                routing: { request: { body: { scope: '={{$value}}' } } },
            },
            {
                displayName: 'Client ID',
                name: 'clientId',
                type: 'string',
                default: '',
                displayOptions: { show: { resource: ['login'] } },
                routing: { request: { body: { client_id: '={{$value}}' } } },
            },
            {
                displayName: 'Client Secret',
                name: 'clientSecret',
                type: 'string',
                default: '',
                displayOptions: { show: { resource: ['login'] } },
                routing: { request: { body: { client_secret: '={{$value}}' } } },
            },
            {
                displayName: 'Operation',
                name: 'operation',
                type: 'options',
                noDataExpression: true,
                displayOptions: {
                    show: { resource: ['addData'] }
                },
                options: [
                    {
                        name: 'Post',
                        value: 'post',
                        action: 'Post the addData',
                        description: 'Post the addData',
                        routing: {
                            request: {
                                method: 'POST',
                                url: '/api/v1/add',
                                headers: { 'Content-Type': 'multipart/form-data' },
                            },
                        },
                    },
                ],
                default: 'post',
            },

            // File to upload 
            {
                displayName: 'Binary Property',
                name: 'binaryPropertyName',
                description: 'Name of the binary property that contains the file',
                type: 'string',
                default: 'data',
                required: true,
                displayOptions: { show: { resource: ['addData'] } },
                // @ts-ignore 
                routing: { request: { formData: { data: '={{ $binary[$value] }}' } } },
            },

            // Optional collection for extra parameters
            {
                displayName: 'Additional Fields',
                name: 'additionalFields',
                type: 'collection',
                placeholder: 'Add Field',
                default: {},
                displayOptions: { show: { resource: ['addData'] } },
                options: [
                    {
                        displayName: 'Dataset ID',
                        name: 'datasetId',
                        type: 'string',
                        default: '',
                        // @ts-ignore 
                        routing: { request: { formData: { datasetId: '={{$value}}' } } },
                    },
                    {
                        displayName: 'Dataset Name',
                        name: 'datasetName',
                        type: 'string',
                        required: true,
                        displayOptions: { show: { resource: ['addData'] } },
                        // @ts-ignore 
                        routing: { request: { formData: { datasetName: '={{$value}}' } } },
                    },
                ],
            },

            {
                displayName: 'Operation',
                name: 'operation',
                type: 'options',
                noDataExpression: true,
                displayOptions: {
                    show: { resource: ['cognify'] },
                },
                options: [
                    {
                        name: 'Post',
                        value: 'post',
                        action: 'Run Cognify',
                        description: 'Trigger cognitive processing for one or more datasets',
                        routing: {
                            request: {
                                method: 'POST',
                                url: '/api/v1/cognify',
                                headers: { 'Content-Type': 'application/json' },
                            },
                        },
                    },
                ],
                default: 'post',
            },
            {
                displayName: 'Dataset IDs',
                name: 'datasetsIds',
                description: 'Comma-separated list of dataset IDs to process',
                type: 'string',
                default: '',
                required: true,
                displayOptions: { show: { resource: ['cognify'] } },
                routing: {
                    request: {
                        body: {
                            datasetsIds: '={{ $value.split(",").map(id => id.trim()) }}',
                        },
                    },
                },
            },
            {
                displayName: 'Additional Fields',
                name: 'additionalFieldsCognify',
                type: 'collection',
                placeholder: 'Add Field',
                default: {},
                displayOptions: { show: { resource: ['cognify'] } },
                options: [
                    {
                        displayName: 'Run In Background',
                        name: 'runInBackground',
                        type: 'boolean',
                        default: false,
                        routing: {
                            request: { body: { runInBackground: '={{$value}}' } },
                        },
                    },
                ],
            },


        ]
    };
}
