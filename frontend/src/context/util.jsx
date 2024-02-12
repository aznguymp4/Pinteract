export const makeErr = (bool, msg) => {
  return bool && <span className="labelErr"><i className="fas fa-exclamation-triangle"/> {msg}</span>
}

const stringSimilar = (s1, s2) => { // float from 0 to 1 indicating how similar two strings are
	if(!s1||!s2) return 0
	let [longer,shorter] = [s1.toLowerCase(),s2.toLowerCase()]
	if (s1.length < s2.length) {
		longer = s2
		shorter = s1
	}
	let longerLength = longer.length;
	if (longerLength == 0) return 1

	let costs = new Array()
	for (let i=0;i<=s1.length;i++) {
		let lastVal = i
		for (let j=0;j<=s2.length;j++) {
			if(!i) costs[j] = j
			else {
				if(j) {
					let newVal = costs[j - 1]
					if(s1.charAt(i-1)!=s2.charAt(j-1)) newVal = Math.min(Math.min(newVal, lastVal), costs[j])+1
					costs[j - 1] = lastVal
					lastVal = newVal
				}
			}
		}
		if (i) costs[s2.length] = lastVal
	}
	return (longerLength - costs[s2.length]) / parseFloat(longerLength)
}

export const filterUserItem = (arr, query) => {
  if(!query) return arr
  return arr.filter(v => 
      v.title?.toLowerCase().includes(query) // Title includes query
    ||v.desc?.toLowerCase().includes(query) // Description includes query
    ||v.title?.split(' ').some(w => stringSimilar(w, query) > .6) // At least one word in Title is 60% close to the query
    ||v.desc?.split(' ').some(w => stringSimilar(w, query) > .65)) // At least one word in Description is 65% close to the query
    // ||query.split('').filter(l=>/\w/.test(l)).every(l => v.title?.toLowerCase().includes(l))) // Display Name contains each letter of query
  .sort((a,b) => stringSimilar(b.title, query) - stringSimilar(a.title, query)) // Sort results (most similar to least similar by query)
  // .sort((a,b) => b.title?.toLowerCase().startsWith(query) - a.title?.toLowerCase().startsWith(query)) // Results starting with query are prioritized
}