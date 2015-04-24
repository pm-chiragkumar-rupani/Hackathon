
var PubMatic = {};
PubMatic.JobAnalysisProduct = {};
PubMatic.JobAnalysisProduct.FileNames = {};
PubMatic.JobAnalysisProduct.Constants = {};
PubMatic.JobAnalysisProduct.Functions = {};

Array.prototype.contains = function(v) {
    for(var i = 0; i < this.length; i++) {
        if(this[i] === v) return true;
    }
    return false;
};

Array.prototype.unique = function() {
    var arr = [];
    for(var i = 0; i < this.length; i++) {
        if(!arr.contains(this[i])) {
            arr.push(this[i]);
        }
    }
    return arr; 
}
