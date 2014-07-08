package org.wso2.carbon.social.cassandra;

import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.wso2.carbon.ndatasource.common.DataSourceException;
import org.wso2.carbon.ndatasource.core.CarbonDataSource;
import org.wso2.carbon.ndatasource.core.DataSourceManager;
import org.wso2.carbon.social.core.Activity;
import org.wso2.carbon.social.core.ActivityBrowser;
import org.wso2.carbon.social.core.SortOrder;

import javax.sql.DataSource;
import java.sql.*;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;

public class CassandraActivityBrowser implements ActivityBrowser {

    private static final Log LOG = LogFactory.getLog(ActivityBrowser.class);
    public static final String SELECT_CQL = "SELECT * FROM " + Constants.STREAM_NAME_IN_CASSANDRA + " WHERE '" +
            Constants.CONTEXT_ID_COLUMN + "'=?";

    private JsonParser parser = new JsonParser();
    //private Connection conn;
    private Cache cache = new Cache();

    @Override public double getRating(String targetId, String tenant) {
        int totalRatings = 0;
        int numRatings = 0;

        JsonObject socialObject = getSocialObject(targetId, tenant, null);
        JsonArray attachments = socialObject.get("attachments").getAsJsonArray();

        for (JsonElement r : attachments) {
            JsonElement ratingElm = r.getAsJsonObject().getAsJsonObject("object").get("rating");
            if (ratingElm != null) {
                numRatings++;
                totalRatings += ratingElm.getAsInt();
            }
        }
        if (numRatings == 0) {
            return 0;
        } else {
            return ((double) totalRatings) / numRatings;
        }
    }

    @Override public JsonObject getSocialObject(String targetId, String tenant, SortOrder order) {
        List<Activity> activities = listActivitiesChronologically(targetId, tenant);
        ActivitySummarizer summarizer = new ActivitySummarizer(targetId, order);
        for (Activity activity : activities) {
            summarizer.add(activity);
        }
        JsonObject summarize = summarizer.summarize();
        cache.put(targetId, tenant, summarize);
        return summarize;
    }

    @Override public List<Activity> listActivities(String contextId, String tenantDomain) {
        List<Activity> activities = null;
        Connection connection = getConnection();
        if (connection != null) {
            PreparedStatement statement = null;
            ResultSet resultSet = null;
            try {
                statement = connection.prepareStatement(SELECT_CQL);
                statement.setString(1, contextId);
                resultSet = statement.executeQuery();
                activities = new ArrayList<Activity>();
                while (resultSet.next()) {
                    JsonObject body = (JsonObject) parser.parse(resultSet.getString(Constants.BODY_COLUMN));
                    String tenant = getTenant(body);
                    if (tenantDomain.equals(tenant)) {
                        Activity activity = new CassandraActivity(body.getAsJsonObject(), resultSet.getInt(Constants.TIMESTAMP_COLUMN));
                        activities.add(activity);
                    }
                }
            } catch (SQLException e) {
                String message = e.getMessage();
                // we'll ignore the "Keyspace EVENT_KS does not exist" error,
                // this happens when there are 0 activities in Cassandra.
                if (!(message.startsWith("Keyspace ") && message.endsWith(" does not exist"))) {
                    LOG.error("Can't retrieve activities from cassandra.", e);
                }
            } finally {
                try {
                    if (statement != null) {
                        statement.close();
                    }
                    if (resultSet != null) {
                        resultSet.close();
                    }
                } catch (SQLException e) {
                    //ignore
                }
                closeConnection(connection);
            }
        }
        if (activities != null) {
            return activities;
        } else {
            return Collections.emptyList();
        }
    }

    private String getTenant(JsonObject body) {
        JsonObject actor = body.getAsJsonObject("actor");
        if (actor != null) {
            String id = actor.get("id").getAsString();
            int j = id.lastIndexOf('@') + 1;
            if (j > 0) {
                return id.substring(j);
            }
        }
        return null;
    }

    @Override public List<Activity> listActivitiesChronologically(String contextId, String tenantDomain) {
        List<Activity> activities = listActivities(contextId, tenantDomain);
        Collections.sort(activities, new Comparator<Activity>() {
            @Override
            public int compare(Activity a1, Activity a2) {
                return a1.getTimestamp() - a2.getTimestamp();
            }
        });
        return activities;
    }


    public void makeIndexes(String column) {
        Connection connection = getConnection();
        if (connection != null) {
            Statement statement = null;
            try {
                statement = connection.createStatement();
                statement.executeUpdate("CREATE INDEX ON " + Constants.STREAM_NAME_IN_CASSANDRA + " ('payload_" + column + "')");
            } catch (SQLException e) {
                LOG.error("Can't create indexes.", e);
            } finally {
                try {
                    if (statement != null) {
                        statement.close();
                    }
                } catch (SQLException e) {
                    //ignore
                }
            }
        }

    }

    public Connection getConnection() {
    	Connection conn = null;
        ///if (conn == null) {
            try {
                CarbonDataSource carbonDataSource = DataSourceManager.getInstance().getDataSourceRepository().getDataSource("SOCIAL_CASSANDRA_DB");
                DataSource dataSource = (DataSource) carbonDataSource.getDSObject();
                conn = dataSource.getConnection();
            } catch (SQLException e) {
                LOG.error("Can't create JDBC connection to Cassandra", e);
            } catch (DataSourceException e) {
                LOG.error("Can't create create data source for Cassandra", e);
            }
        //}
        return conn;
    }
    
    public void closeConnection(Connection connection){
    	try {
			connection.close();
		} catch (SQLException e) {
			LOG.error("Can't close JDBC connection to Cassandra", e);
		}  	
    }
}
