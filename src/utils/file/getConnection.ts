import type { Edge, File, Node } from '../types'

export const getConnection = (match: RegExpExecArray, file: File, fileIndex: number, nodes: Node[], edges: Edge[]) => {
	const tempEdges: Edge[] = []
	let importPath = match[1]

	// filter out lowercase importpath
	if (importPath.toLowerCase() === importPath) {
		return { nodes: [], edges: tempEdges }
	}

	// Remove any List<> or ExampleClass<> wrapping
	importPath = getGenericTypeContent(importPath)

	const index = getNodeConnection(importPath, nodes)

	// If the connection already exists or no connection found, skip it
	if (
		index === -1
		|| edges.find(
			connection => connection.id === `${fileIndex}-${index}`,
		)
	) { return { nodes: [], edges: tempEdges } }

	tempEdges.push({
		id: `${fileIndex}-${index}`,
		to: fileIndex,
		from: index,
	})

	return { nodes: [], edges: tempEdges }
}

export const getGenericTypeContent = (type: string): string => {
	// Check if there is generic type wrapping
	const match = type.match(/<(.+)>/)
	if (match) {
		// Extract the inner type and recursively call the function
		// in case of nested generic types
		return getGenericTypeContent(match[1])
	}
	return type
}

const getNodeConnection = (importPath: string, nodes: Node[]) => {
	let result = -1

	nodes.forEach((node, index) => {
		const nodePath = node.label.split('.')[0]

		if (nodePath === importPath) {
			result = index
		}
	})

	return result
}
