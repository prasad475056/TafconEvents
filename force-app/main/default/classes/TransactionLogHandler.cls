public with sharing class TransactionLogHandler {
    public Static void doHandleException(system.Exception ex, string processName) {
        Error_Log__c TransactionLog = new Error_Log__c(
            Log_Details__c = ex.getStackTraceString() +'<br/> <strong> Mesage is </strong> ' + ex.getMessage() 
            + '<br/> ' + ex.getCause() +' <br/> '+ ex.getTypeName()+' <br/> '+ex.getLineNumber(),
            Log_Date_Time__c = system.now(),
            Process_Name__c = processName
        );
        insert TransactionLog;
    }
    public static void doHandleException(System.Exception ex , String processName, String errorMessage){
        string htmlBody = '';
        if(ex != null){
            htmlBody = ex.getStackTraceString() +'<br/> <strong> Mesage is </strong> ' + ex.getMessage() 
            + '<br/> ' + ex.getCause() +' <br/> '+ ex.getTypeName()+' <br/> '+ex.getLineNumber();
        }
        if(!string.isBlank(errorMessage)){
            htmlBody += errorMessage;
        }
        Error_Log__c TransactionLog = new Error_Log__c(
            Log_Details__c = htmlBody,
            Log_Date_Time__c = system.now(),
            Process_Name__c = processName
        );
        insert TransactionLog;
    }
    public static void doHandleExceptionWithError(String errors , String processName){
        Error_Log__c TransactionLog = new Error_Log__c(
            Log_Details__c = errors,
            Log_Date_Time__c = system.now(),
            Process_Name__c = processName
        );
        insert TransactionLog;
    }
}