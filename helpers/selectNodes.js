const selectNodes = (inf) => {
  const { fieldNodes } = inf
  const { selections } = fieldNodes[0].selectionSet
  // get variables of query
  const { variableValues } = inf

  const nodes = getNodes(selections, variableValues)

  return variableValues.paginate
    ? { ...nodes, ...variableValues.paginate }
    : nodes
}

const getNodes = (selections, variableValues = {}) => {
  let select = []
  let nodes = [...selections]

  selections.forEach((element) => {
    const node = nodes.pop()
    const { value } = node.name

    if (!node.selectionSet && value !== '__typename') {
      select[value] = true
    } else if (node.selectionSet?.selections.length > 0) {
      select[value] = getNodes(node.selectionSet?.selections)

      //get variables of paginate field
      select[value] = variableValues[`pag${value}`]
        ? { ...select[value], ...variableValues[`pag${value}`] }
        : select[value]
    }
  })

  return { select: { ...select } }
}

module.exports = selectNodes
