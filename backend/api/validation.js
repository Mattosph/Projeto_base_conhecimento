module.exports = app => {
    function existsOrError(value,msg) {// if the value does exists it will be ok , if not it generates an error

        if(!value) throw msg // if a value is in blank , generates an error
        
        if(Array.isArray(value) && value.lenght === 0) throw msg // verifies if the value is an Array and if it is in blank
        
        if(typeof value === 'string' && !value.trim()) throw msg //Verifies if it is a  empty string or a string containing blank spaces are also considered as an error
        
        }
        
        function notExistsOrError(value,msg) { // In this functions are checked the things that must not exist
                try{
                    existsOrError(value, msg) // if exists it means there is an error 
        
                } catch(msg){ //if there is an error it is ok , the condition dos not exist and for this function it is alright
                    return
                } 
                throw msg // But if there is not an error... the value exists and it should not... We have a ERROR msg
         }
        
         function equalsOrError(valueA, valueB, msg){ //Verifies if the values are exactly equal or generates an error
         if (valueA !== valueB) throw msg
        
         }
        
         // here in validation.js can be included other validating conditions suchs as email, password rules, characters existance, and so on...
        
         return { existsOrError, notExistsOrError, equalsOrError }

         //!!! all the condition shall be exported via module.exports to app implementation.
}