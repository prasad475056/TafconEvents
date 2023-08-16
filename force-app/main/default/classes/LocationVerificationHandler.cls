public with sharing class LocationVerificationHandler {
   @future(callout=true)
    public Static void verifyLocation(string RecordId) {
        Location__c Location = [select id, Name, City__c, Country__c, Land_Mark__c, Postal_code__c,State__c, Street__c, Verified__c from Location__c where id = : RecordId];

        string baseURL = 'https://us-street.api.smartystreets.com/street-address?auth-id=433e9c89-71ea-ebbf-ce86-4510023123ee&auth-token=zy27lsCxQjittRzy5vv7';

        baseURL += '&street='+EncodingUtil.urlEncode(Location.Street__c, 'UTF-8')
        +'&city='+EncodingUtil.urlEncode(Location.City__c,'UTF-8')
        +'&state='+EncodingUtil.urlEncode(Location.State__c,'UTF-8')
        +'&zipcode='+EncodingUtil.urlEncode(Location.Postal_code__c,'UTF-8')
        +'&candidates=10&match=invalid';

        Http http = new Http();
        HttpRequest request  = new HttpRequest();
        request.setMethod('GET');
        request.setEndpoint(baseURL);

        HttpResponse response = new HttpResponse();

        try {
            response = http.send(request);
            system.debug('response ='+response.getBody());
            if(response.getStatusCode()== 200 && response.getStatus() == 'OK'){
                string res = response.getBody();
                 if(!string.isBlank(res) && res.length()> 2){
                     Location.Verified__c = true;
                 }else {
                     Location.Verified__c = false;
                    }
                    update Location;
            }else{
                    TransactionLogHandler.doHandleExceptionWithError(response.getBody(), 'LocationTriggerHandler');
            }        
        } catch (System.CalloutException ex) {
            System.debug(' Exception Executed '+ex.getStackTraceString());
            TransactionLogHandler.doHandleException(ex, 'LocationTriggerHandler');
            
        }

        
    }
}