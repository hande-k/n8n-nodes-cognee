import { IAuthenticateGeneric, ICredentialType, INodeProperties } from 'n8n-workflow';


export class CogneeApi implements ICredentialType {
    name = 'CogneeApi';
    displayName = 'Cognee API';
    documentationUrl = 'https://docs.n8n.io/integrations/creating-nodes/build/declarative-style-node/';
    properties: INodeProperties[] = [
        {
            displayName: 'Access Token',
            name: 'accessToken',
            type: 'string',
            default: '',
        },
    ];
    authenticate = {
        type: 'generic',
        properties: {
            headers: {
                Authorization: 'Bearer {{$credentials.accessToken}}',
            },
        },
    } as IAuthenticateGeneric;
}