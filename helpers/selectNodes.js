const selectNodes = (inf) => {
  const { fieldNodes } = inf
  const { selections } = fieldNodes[0].selectionSet

  const nodes = getNodes(selections)

  return nodes
}

const getNodes = (selections) => {
  let select = []
  let nodes = [...selections]

  selections.forEach((element) => {
    const node = nodes.pop()
    const { value } = node.name

    if (!node.selectionSet) {
      select[value] = true
    } else {
      select[value] = getNodes(node.selectionSet?.selections)
    }
  })

  return { select: { ...select } }
}

module.exports = selectNodes
