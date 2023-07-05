import * as vscode from 'vscode'

import type { Edge, File, Node } from './utils/types'

import { getConnection } from './utils/file/getConnection'

export interface Data {
  message: File[]
}

export interface PluginData {
	name: string
	regex: RegExp[]
	getConnection: (match: RegExpExecArray, file: File, fileIndex: number, nodes: Node[], edges: Edge[]) => { nodes: Node[]; edges: Edge[] }
}

export const activate = async (context: vscode.ExtensionContext) => {
	// eslint-disable-next-line no-console -- For Testing Purposes
	console.log('CodeGraphy - C# Plugin activated!')

	await vscode.commands.executeCommand(
		'codegraphy.registerPlugin',
		{
			name: 'CSharpPlugin',
			regex: [
				/(?:public|private|protected|internal|static|readonly|volatile)\s+([\w<>?]+)\s+(?:[\w<>?]+\s*(?:,\s*[\w<>?]+\s*)*)\s*;\s*(?:\/\/.*)?$/gm,
			],
			getConnection,
		},
	)
}
