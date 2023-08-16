global with sharing class EventBatchDeleteHandler implements database.Batchable<SObject> {
    global Database.QueryLocator start(Database.BatchableContext bcontext){
        string query = 'select id,Name__c,End_Date_Time__c,Live__c from Event__c where Live__c=true AND End_Date_Time__c=LAST_N_MONTHS:2';
        return Database.getQueryLocator(query);
    } 
    global void execute(Database.BatchableContext bcontext, list<Event__C> eventRecordsToDelete){
        if(!eventRecordsToDelete.isEmpty()){
            list<Database.DeleteResult> Result = Database.Delete(eventRecordsToDelete);
            for(Database.DeleteResult Deleteresult : Result){
                if(!Deleteresult.isSuccess()){
                    List<Database.Error> errors = Deleteresult.getErrors();
                    String errorInString = String.join(errors, ',');
                    TransactionLogHandler.doHandleExceptionWithError(errorInString, 'DeleteEventBatch');
                }
            }
        }
    }
    global void finish(Database.BatchableContext bcontext){
        Messaging.SingleEmailMessage mail = new Messaging.SingleEmailMessage();
        mail.setSubject('Batch Processing Completed');
        List<String> toAddress = new List<String>();
        toAddress.add('p.prasad.00047@gmail.com');
        mail.setToAddresses( toAddress );
        mail.setSenderDisplayName('SFDCPrasad');
        mail.setHtmlBody('The DeleteEventBatch Batch Prcoessing has been Completed');
        List<Messaging.SingleEmailMessage> emails = new List<Messaging.SingleEmailMessage> {mail};
        Messaging.sendEmail(emails);
    }
}